import { Controller,Get,Post,Req,Res,Param,Body } from "@nestjs/common";
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
            return name;
        }else{
            return '로그인 해주세요.';
        }
    }


    @Post("/download/gym/:type")
    async gym_view(@Req() req:any,@Param("type") type:string,@Body("keyword") keyword:string){

        const name = await this.login_auth(req.cookies.user);


        const files =  await this.listViewService.gym_view(type,name,keyword);
        return {files:files.files,id:files.id};
    }

    @Post("/download/free/:type")
    async free_view(@Req() req:any, @Param("type") type:string,@Body("keyword") keyword:string){

            const name = await this.login_auth(req.cookies.user);
const files =  await this.listViewService.free_view(type,name,keyword);

return {files:files.files,id:files.id,writer_is_me:files.writer_is_me};

}

@Post("/download/paid/:type")
async paid_view(@Req() req:any, @Param("type") type:string,@Body("keyword") keyword:string){

        const name = await this.login_auth(req.cookies.user);
const files =  await this.listViewService.paid_view(type,name,keyword);

return {files:files.files,id:files.id,writer_is_me:files.writer_is_me};

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

        return {file:ret.file,name:ret.name,writer_is_me:ret.writer_is_me,id:ret.id,purchased:ret.purchased};
}
 

}



@Get("/community_featured")
async community_featured(){
    const ret = await this.listViewService.featured_post();
    return { post: ret.post, kind: ret.kind };
}

@Post("/community/:type")
async commuity_list_view(@Param("type") type:string,@Req() req:any,@Body("keyword") keyword:string,@Body("sort") sort:string){
    try{
        const name= await this.login_auth(req.cookies.user);

        const ret = await this.listViewService.community_list_view(type,name,keyword,sort);

        return {name:name,posts:ret.list};
    }catch(error){
        return {message:error};
    }

}

@Get("/community/:type/:id")
async commuity_post_load(@Param("type") type:string,@Param("id") id : string,@Req() req:any,@Res({passthrough: true}) res:any){
    try{
        
        const viewer = req.cookies.user;
        console.log(viewer);
const name = await this.login_auth(viewer);
console.log(name);
        const cookieKey = `viewed_${viewer}`;
        const alreadyViewed = req.cookies[cookieKey];
        if(!alreadyViewed){
             // 자정까지 유효한 쿠키로 설정 (하루에 한 번만 카운트)
         res.cookie(cookieKey, 'true', {
        maxAge: 12 * 60 * 60 * 1000, // 12시간
        httpOnly: true,
      });
      
       const ret = await this.viewService.community_post_count_view(type,id,name,viewer);
       return {name:name,post:ret.post,myId:viewer,writer_is_me:ret.writer_is_me,is_admin:ret.is_admin};
        }

        const ret = await this.viewService.community_post_view(type,id,name,viewer);

        return {name:name,post:ret.post,myId:viewer,writer_is_me:ret.writer_is_me,is_admin:ret.is_admin};
    }catch(error){
      
        return {message:error};
    }
    
}









}