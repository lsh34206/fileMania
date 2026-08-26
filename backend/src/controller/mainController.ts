import { Controller,Get,Post,Req,Res,Body,Param } from "@nestjs/common";
import { authService } from "../service/auth";
import { socketService } from "src/service/socket";
import cookieParser from "cookie-parser";
import { Request } from 'express';
import { ObjectId } from "mongoose";
import { stringify } from "querystring";





@Controller()
export class mainController{
constructor(
  private readonly authService:authService,
  private readonly socketService:socketService,
){}

    @Get("/online_users")
    async onlineUsers(){
      const users = await this.socketService.getOnlineUsers();
      return { users: users };
    }

    @Get("home")
    async home(@Req() req: any){
      console.log(req.cookies.user);
      if (!req.cookies.user) {
        return { name: null };
      }
    
      const name = await this.authService.login_Load(req.cookies.user);
      const role = await this.authService.role_Load(req.cookies.user);
      console.log('loaded name:', name);

      return { name: name, role: role };
        
       
    }

    @Get("/mypage")
    async mypage(@Req() req: any){
      if (!req.cookies.user) {
        return { user: null };
      }

      const user = await this.authService.mypage_Load(req.cookies.user);
      return { user: user };
    }

    @Post("/mypage/bio")
    async updateBio(@Req() req: any, @Body("bio") bio: string){
      if (!req.cookies.user) {
        return { success: false, message: '로그인이 필요합니다.' };
      }

      const user = await this.authService.updateBio(req.cookies.user, bio ?? '');
      return { success: true, user: user };
    }

    @Get("/profile/:name")
    async profile(@Param("name") name: string){
      const user = await this.authService.profile_Load(name);
      return { user: user };
    }

    @Get("/logout")
    async logout(@Req() req:any,@Res() res : any){


      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: '로그아웃 실패',
          });
        }
      
        res.clearCookie('user', { httpOnly: true,path: '/' });
        res.clearCookie('name', {  httpOnly: true,path: '/' });
      
        // 세션 쿠키까지 제거
        res.clearCookie('connect.sid', { httpOnly: true,path: '/' });
      
        return res.json({
          success: true,
          message: '로그아웃 완료',
        });
      });
    }

    @Post("/singup_ok")
    async singup(@Body() body){
      const name = body.name;
      const id = body.id;
      const email = body.email;
      const password = body.password;
      const password_check = body.password_check;
      const data = {
        name:name,
          id:id,
          email:email,
          password:password,
         password_check:password_check
    };
    return await this.authService.singup_ok(data);    
    }


    @Post("/login_ok")
    async login(@Req() req:any,@Res() res:any){

      const id = req.body.id;
      const password = req.body.password;
const pw_Check = await this.authService.pw_Check({id,password});
try{
   
            if(pw_Check.is_password) {
         
            req.session.user = pw_Check.user;
            console.log(req.session.name)
            res.cookie('user', pw_Check.user,{
            
                httpOnly:true,
                 path:"/",
                 sameSite: 'none',
secure: true
            });

         

            res.json(pw_Check.res);
            }else{
                 res.json(pw_Check.res);
            }
        

}catch(error){
  res.json({success: false, message: "로그인 실패"});
    console.log(error);
}     

    }


   

}
