import { Controller,Get,Post,Req,Res,Body,Param,UseGuards } from "@nestjs/common";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";
import { authService } from "../service/auth";
import { socketService } from "src/service/socket";


const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

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
      if (!req.signedCookies.user) {
        return { name: null };
      }

      const name = await this.authService.login_Load(req.signedCookies.user);
      const role = await this.authService.role_Load(req.signedCookies.user);

      return { name: name, role: role };


    }

    @Get("/mypage")
    async mypage(@Req() req: any){
      if (!req.signedCookies.user) {
        return { user: null };
      }

      const user = await this.authService.mypage_Load(req.signedCookies.user);
      return { user: user };
    }

    @Post("/mypage/bio")
    async updateBio(@Req() req: any, @Body("bio") bio: string){
      if (!req.signedCookies.user) {
        return { success: false, message: '로그인이 필요합니다.' };
      }

      const user = await this.authService.updateBio(req.signedCookies.user, bio ?? '');
      return { success: true, user: user };
    }

    @Get("/profile/:name")
    async profile(@Param("name") name: string){
      const user = await this.authService.profile_Load(name);
      return { user: user };
    }

    @Get("/logout")
    async logout(@Req() req:any,@Res() res : any){
      res.clearCookie('user', { path: '/' });

      return res.json({
        success: true,
        message: '로그아웃 완료',
      });
    }

    @Post("/singup_ok")
    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { limit: 5, ttl: 60000 } })
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
    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    async login(@Req() req:any,@Res() res:any){

      const id = req.body.id;
      const password = req.body.password;
const pw_Check = await this.authService.pw_Check({id,password});
try{


            if(pw_Check.is_password) {

            res.cookie('user', pw_Check.user, {
                ...AUTH_COOKIE_OPTIONS,
                signed: true,
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
