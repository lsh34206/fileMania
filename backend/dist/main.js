"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const module_1 = require("./module/module");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(module_1.mainModule);
    app.use((0, cookie_parser_1.default)());
    app.enableCors({
        origin: true,
        credentials: true
    });
    app.use((0, express_session_1.default)({
        secret: 'filemania',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
        },
    }));
    app.setGlobalPrefix('api');
    await app.listen(8080, () => { console.log("서버시작"); });
}
bootstrap();
//# sourceMappingURL=main.js.map