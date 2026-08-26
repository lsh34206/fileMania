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
        origin: true,
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