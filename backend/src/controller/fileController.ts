import { Controller,Post,Body,Param,BadRequestException , UseInterceptors, UploadedFile, Req } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import fs from "fs";
import { diskStorage} from 'multer';
import * as path from 'path';
import * as crypto from 'crypto';
import { UploadService } from "src/service/fileUpload";

const ALLOWED_TYPES = ['image', 'video', 'audio', 'document', 'app'];

for(const type of ALLOWED_TYPES){
    const dir = path.join(process.cwd(), 'files', type);
    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
}

@Controller()
export class fileController{


    constructor(private readonly uploadService:UploadService){}


    @UseInterceptors(FileInterceptor("file", {
        limits: { fileSize: 500 * 1024 * 1024 },
        storage: diskStorage({
          destination: (req:any, file, cb) => {
            if(!ALLOWED_TYPES.includes(req.params.type)){
              return cb(new BadRequestException('잘못된 파일 종류입니다.'), '');
            }
            cb(null, path.join(process.cwd(), 'files', req.params.type));
          },
          filename: (req:any, file, cb) => {
            const ext = path.extname(file.originalname).replace(/[^a-zA-Z0-9.]/g, '').slice(0, 20);
            cb(null, `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`);
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
      if(!ALLOWED_TYPES.includes(type)){
        return { success: false, message: '잘못된 파일 종류입니다.' };
      }

      const data = rawData
        ? JSON.parse(rawData)
        : { type, title: '', description: '', download_type: 'free' };

      const res = this.uploadService.uploadFile( {
        file,
        data,
        userId: req.signedCookies.user,
        type,
      });

      return res;

    }
}
