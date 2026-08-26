import { Controller,Get,Post,Req,Res,Param, Body } from "@nestjs/common";
import {listViewService } from "src/service/listView";
import { authService } from "src/service/auth";
import { ViewService } from "src/service/view";
import { postActionService } from "src/service/postActionService";

@Controller()
export class postActionController{
    constructor(private readonly listViewService:listViewService,
        private readonly authService:authService,
        private readonly viewService:ViewService,
        private readonly postActionService:postActionService
    ){}

    async login_auth(userid:string) {

        const name =  await this.authService.login_Load(userid);

        if(name != null){
            return name;
        }else{
            return '로그인 해주세요.';
        }
    }

    @Post("/community/like/:postId")
    async community_post_like(@Param("postId") postId:string,@Req() req:any){
      const userId = req.cookies.user;
      const name = await this.login_auth(userId);
      const ret = await this.postActionService.community_post_like(postId,userId);
      console.log(ret);
      return {like_count:ret.like_count,myId:userId,message:ret.message,name:name};
    }

    @Post("/community/comment/:postId")
    async community_comment_write(@Param("postId") postId:string,@Req() req:any,@Body("content") content:string,@Body("parent_id") parent_id:string){
      const userId = req.cookies.user;
      if(!userId){
        return {success:false,message:'로그인 해주세요.'};
      }
      const name = await this.login_auth(userId);
      const ret = await this.postActionService.community_comment_write(postId,parent_id,name,userId,content);
      console.log(ret);
      return {success:ret.success,message:ret.message,name:name,myId:userId};
    }

    @Post("/community/comment_like/:postId/:comment_id")
    async community_comment_like(@Param("postId") postId:string,@Param("comment_id") comment_id:string,@Req() req:any){
      const userId = req.cookies.user;
      const name = await this.login_auth(userId);
      const ret = await this.postActionService.community_comment_like(postId,comment_id,userId);
      console.log(ret);
      return {success:ret.success,message:ret.message,name:name,myId:userId};
    }

    @Post("/community/comment_delete/:postId/:type/:comment_id")
    async community_comment_delete(@Param("postId") postId:string,@Param("comment_id") comment_id:string,@Param("type") type:string,@Req() req:any){
      const userId = req.cookies.user;
      if(!userId){
        return {success:false,message:'로그인 해주세요.'};
      }
      const name = await this.login_auth(userId);
      const ret = await this.postActionService.community_comment_delete(postId,type,comment_id,userId);
      console.log(ret);
      return {success:ret.success,message:ret.message,name:name,myId:userId};
    }

     @Post("/community/post_delete/:postId/:type")
    async community_post_delete(@Param("postId") postId:string,@Param("type") type:string,@Req() req:any){
      const userId = req.cookies.user;
      if(!userId){
        return {success:false,message:'로그인 해주세요.'};
      }
      const name = await this.login_auth(userId);
      const ret = await this.postActionService.community_post_delete(postId,type,userId);
      console.log(ret);
      return {success:ret.success,message:ret.message,name:name,myId:userId};
    }
}