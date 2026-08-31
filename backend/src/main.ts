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
        origin: process.env.FRONTEND_URI_VALUE,
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



//app.setGlobalPrefix('api');


    await app.listen(8080,()=>{console.log("서버시작");});
    
}

bootstrap();