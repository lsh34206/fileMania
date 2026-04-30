import { Controller,Get,Post,Req,Body,Res,Param,BadRequestException , UseInterceptors, UploadedFile } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import fs from "fs";
import { diskStorage} from 'multer';
import multer from "multer";
import * as path from 'path';
import { UploadService } from "src/service/fileUpload";

const imagePath = path.join(process.cwd(), 'files', 'image');
const videoPath = path.join(process.cwd(), 'files', 'video');
const audioPath = path.join(process.cwd(), 'files', 'audio');
const documentPath = path.join(process.cwd(), 'files', 'document');
const appPath = path.join(process.cwd(), 'files', 'app');


if(!fs.existsSync(imagePath)){
    fs.mkdirSync(imagePath, { recursive: true });
}
if(!fs.existsSync(videoPath)){
    fs.mkdirSync(videoPath, { recursive: true });
}
if(!fs.existsSync(audioPath)){
    fs.mkdirSync(audioPath, { recursive: true });
}
if(!fs.existsSync(documentPath)){
    fs.mkdirSync(documentPath, { recursive: true });
}
if(!fs.existsSync(appPath)){
    fs.mkdirSync(appPath, { recursive: true });
}

const image_storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, imagePath);
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});

const video_storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, videoPath);
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});

const audio_storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, audioPath);
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});

const document_storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, documentPath);
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});

const app_storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, appPath);
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});
var upload_path = null;

const uploadByType = {
    image: multer({ storage: image_storage }).single('file'),
    video: multer({ storage: video_storage }).single('file'),
    audio: multer({ storage: audio_storage }).single('file'),
    document: multer({ storage: document_storage }).single('file'),
    app: multer({ storage: app_storage }).single('file'),
  };

@Controller()
export class fileController{


    constructor(private readonly uploadService:UploadService){}

    
    @UseInterceptors(FileInterceptor("file", {
        storage: diskStorage({
          destination: (req:any, file, cb) => {
            cb(null, path.join(process.cwd(), 'files', req.params.type));
          },
          filename: (req:any, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
          },
        }),
      }),
    )

    @Post("/file_upload_ok/:type")
    async upload(
      @Param('type') type: string,
      @UploadedFile() file: Express.Multer.File,
      @Body('data') rawData: string,
      @Req() req: any,
    ) {
      const data = rawData
        ? JSON.parse(rawData)
        : { type, title: '', description: '', download_type: 'free' };
    
      const res = this.uploadService.uploadFile( {
        file,
        data,
        userId: req.cookies.user,
        type,
      });

      return res;
    
    }
}
