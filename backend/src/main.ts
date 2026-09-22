import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { mainModule } from "./module/module";
import cookieParser from "cookie-parser";
import { COOKIE_SECRET } from "./utils/cookieAuth";
import { csrfGuard } from "./middleware/csrf.middleware";


async function bootstrap() {

    const app = await NestFactory.create(mainModule);

    app.use(cookieParser(COOKIE_SECRET));

    app.enableCors({
        origin: process.env.FRONTEND_URI_VALUE,
        credentials:true
      });

    app.use(csrfGuard);


//app.setGlobalPrefix('api');


    await app.listen(8080,()=>{console.log("서버시작");});

}

bootstrap();
