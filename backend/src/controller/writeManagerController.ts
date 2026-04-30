import { Controller,Get,Post,Req,Body,Res,Param,BadRequestException , UseInterceptors, UploadedFile } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { diskStorage} from 'multer';
import multer from "multer";

import { authService } from "src/service/auth";
import { writeManagerService } from "src/service/writeManager";

@Controller()
export class writeManagerController{

    constructor(private readonly authService:authService,
        private readonly writeManagerService:writeManagerService
    ){}

    @Get("/writer_delete/:download_type/:type/:id")
    async writer_delete(
    @Param("download_type") download_type:string,
    @Param("type") type: string,
    @Param("id") id: string){
        
        const ret = await this.writeManagerService.writer_delete(download_type,type,id);

return {success:ret.success}

    }
}