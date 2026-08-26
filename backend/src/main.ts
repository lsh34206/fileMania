import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { mainModule } from "./module/module";
import cookieParser from "cookie-parser";
import path from "path";
import session from 'express-session';


async function bootstrap() {

    const app = await NestFactory.create(mainModule);
app.use(cookieParser());

    app.enableCors({
        origin: ["http://ec2-15-164-230-209.ap-northeast-2.compute.amazonaws.com"],
        credentials:true
      });
      

      app.use(
        session({
          secret: 'filemania',
          resave: false,
          saveUninitialized: false,
          cookie: {
            httpOnly: true,
          },
        }),
      );






    await app.listen(8080,()=>{console.log("서버시작");});
    
}

bootstrap();