"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const module_1 = require("./module/module");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cookieAuth_1 = require("./utils/cookieAuth");
const csrf_middleware_1 = require("./middleware/csrf.middleware");
async function bootstrap() {
    const app = await core_1.NestFactory.create(module_1.mainModule);
    app.use((0, cookie_parser_1.default)(cookieAuth_1.COOKIE_SECRET));
    app.enableCors({
        origin: process.env.FRONTEND_URI_VALUE,
        credentials: true
    });
    app.use(csrf_middleware_1.csrfGuard);
    await app.listen(8080, () => { console.log("서버시작"); });
}
bootstrap();
//# sourceMappingURL=main.js.map