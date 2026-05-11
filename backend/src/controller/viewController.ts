import { Controller,Get,Post,Req,Res,Param } from "@nestjs/common";
import {listViewService } from "src/service/listView";
import { authService } from "src/service/auth";
import { ViewService } from "src/service/view";
import { write } from "fs";

@Controller()
export class viewController{
    constructor(private readonly listViewService:listViewService,
        private readonly authService:authService,
        private readonly viewService:ViewService
    ){}

    async login_auth(userid:string) {
        const name =  await this.authService.login_Load(userid);

        if(name != null){
            return name.name ;
        }else{
            return '로그인 해주세요.';
        }
    }


    @Post("/download/gym/:type")
    async gym_view(@Req() req:any,@Param("type") type:string){
       
        const name = await this.login_auth(req.cookies.user);

     
        const files =  await this.listViewService.gym_view(type,name);
        return {files:files.files,id:files.id};
    }

    @Post("/download/free/:type")
    async free_view(@Req() req:any, @Param("type") type:string){
      
            const name = await this.login_auth(req.cookies.user);
const files =  await this.listViewService.free_view(type,name);

return {files:files.files,id:files.id};

}

@Post("/download/paid/:type")
async paid_view(@Req() req:any, @Param("type") type:string){
  
        const name = await this.login_auth(req.cookies.user);
const files =  await this.listViewService.paid_view(type,name);

return {files:files.files,id:files.id};

}


@Get("/download/:download_type/:type/:id")
async view_file(@Req() req:any,
@Param("download_type") download_type:string,
@Param("type") type: string,
@Param("id") id: string){

if(download_type==="gym"){

    const ret = await this.viewService.gym_view(download_type,type,id,req.cookies.user);

    return { file:ret.file,name:ret.name,writer_is_me:ret.writer_is_me,id:ret.id,user_id:ret.user_id,
        chatList:ret.chatList,
        bidsList:ret.bidsList,
        gym:ret.gym
    }


}else{
           const ret = await this.viewService.view_file(download_type,type,id,req.cookies.user);

        return {file:ret.file,name:ret.name,writer_is_me:ret.writer_is_me,id:ret.id};
}
 

}






}