import { Controller,Get,Delete,Param,Req } from "@nestjs/common";
import { messageService } from "src/service/messageService";

@Controller()
export class messageController{
    constructor(private readonly messageService:messageService){}

    @Get("/message")
    async message_main(@Req() req:any){
        if(!req.cookies.user){
            return { name: null };
        }

        const ret = await this.messageService.message_main(req.cookies.user);
        if(ret === null){
            return { name: null };
        }

        return ret;
    }

    @Delete("/message/:id")
    async delete_mail(@Req() req:any, @Param("id") id:string){
        if(!req.cookies.user){
            return { success: false, message: '로그인 해주세요.' };
        }

        return await this.messageService.deleteMail(req.cookies.user, id);
    }
}
