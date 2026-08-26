import { Controller, Post, Req, Param } from "@nestjs/common";
import { purchaseService } from "src/service/purchaseService";

@Controller("purchase")
export class purchaseController {
    constructor(private readonly purchaseService: purchaseService) {}

    @Post(":type/:id")
    async purchase(@Req() req: any, @Param("type") type: string, @Param("id") id: string) {
        if (!req.cookies.user) {
            return { success: false, message: '로그인 해주세요.' };
        }
        return await this.purchaseService.purchase(req.cookies.user, type, id);
    }
}
