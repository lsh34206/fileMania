import { Controller,Get,Post,Req,Body,Res,Param,BadRequestException , UseInterceptors, UploadedFile } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { diskStorage} from 'multer';
import multer from "multer";
import type { Response } from 'express';
import { authService } from "src/service/auth";
import { downloadService } from "src/service/download";

@Controller("download_file")
export class downloadController{

    constructor(private readonly authService:authService,
        private readonly downloadService:downloadService
    ){}

    @Get("/:type/:id")
    async download(
    @Param("type") type: string,
    @Param("id") id: string, @Res() res:Response){
        try{
            const result = await this.downloadService.download_file(type,id);
               

            if (!result.success || !result.path || !result.name) {
                return res.status(404).json(result);
              }
              
         
            
              return res.download(result.path,result.name)

        }catch(error){
            return res.status(500).json({
                success: false,
                message: error.message,
              });
        }
    }
}