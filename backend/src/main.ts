import { NestFactory } from "@nestjs/core";
import { mainModule } from "./module/module";
import cookieParser from "cookie-parser";
import path from "path";
import session from 'express-session';


async function bootstrap() {

    const app = await NestFactory.create(mainModule);
app.use(cookieParser());
    app.enableCors({
        origin: ["http://localhost:5173","https://2359-124-194-149-252.ngrok-free.app"],
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