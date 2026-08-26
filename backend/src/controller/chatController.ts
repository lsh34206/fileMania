import { Controller,Get,Param,Req } from "@nestjs/common";
import { chatService } from "src/service/chatService";
import { authService } from "src/service/auth";

@Controller()
export class chatController{
    constructor(private readonly chatService:chatService,private readonly authService:authService){}


    async login_auth(userid:string) {
        const name =  await this.authService.login_Load(userid);

        if(name != null){
            return name;
        }else{
            return '로그인 해주세요.';
        }
    }


    @Get("/chat")
    async chat_main(@Req() req:any){
        if(!req.cookies.user){
            return { name: null };
        }

        const name = await this.login_auth(req.cookies.user);
        if(name === '로그인 해주세요.'){
            return { name: null };
        }

        const ret= await this.chatService.main_load(req.cookies.user);
        if(ret === null){
            return { name: null };
        }

        return {data:ret,name:name};
    }

    @Get("/chat/:room_id")
    async chat_room(@Req() req:any,@Param("room_id") room_id:string){
        if(!req.cookies.user){
            return { name: null };
        }
    }
}
