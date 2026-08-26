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

    async login_auth(userid:string) {
        const name =  await this.authService.login_Load(userid);

        if(name != null){
            return name;
        }else{
            return '로그인 해주세요.';
        }
    }

    @Get("/writer_delete/:download_type/:type/:id")
    async writer_delete(
    @Req() req:any,
    @Param("download_type") download_type:string,
    @Param("type") type: string,
    @Param("id") id: string){

        const ret = await this.writeManagerService.writer_delete(download_type,type,id,req.cookies.user);

return {success:ret.success, message:ret.message}

    }


    @Post("/community/write_ok/:type")
    async community_write(@Param("type") type: string,
    @Req() req:any,
    @Body("data") data:string){


        const ret = await this.writeManagerService.community_write_ok(req.cookies.user,type,data)

        return {success:ret.success, message:ret.message}
    }

    @Post("/community/edit_ok/:type/:id")
    async community_edit(
    @Param("type") type: string,
    @Param("id") id: string,
    @Req() req:any,
    @Body("data") data:string){

        if(!req.cookies.user){
            return { success:false, message:'로그인 해주세요.' };
        }

        const ret = await this.writeManagerService.community_edit_ok(req.cookies.user,id,type,data);

        return { success:ret.success, message:ret.message, category:ret.category };
    }

    @Post("/file_edit_ok/:type/:id")
    async file_edit(
    @Param("type") type: string,
    @Param("id") id: string,
    @Req() req:any,
    @Body("data") data:string){

        if(!req.cookies.user){
            return { success:false, message:'로그인 해주세요.' };
        }

        const parsed = data ? JSON.parse(data) : {};
        const ret = await this.writeManagerService.file_edit_ok(req.cookies.user,type,id,parsed);

        return { success:ret.success, message:ret.message };
    }
}