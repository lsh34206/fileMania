import { Controller, Post, Body, Req } from "@nestjs/common";
import { paymentService } from "src/service/paymentService";

@Controller("payment")
export class paymentController {
    constructor(private readonly paymentService: paymentService) {}

    @Post("point/order")
    async createOrder(@Req() req: any, @Body() body: { amount: number }) {
        if (!req.signedCookies.user) {
            return { success: false, message: '로그인 해주세요.' };
        }
        return await this.paymentService.createOrder(req.signedCookies.user, Number(body.amount));
    }

    @Post("point/confirm")
    async confirm(
        @Req() req: any,
        @Body() body: { paymentKey: string; orderId: string; amount: number },
    ) {
        if (!req.signedCookies.user) {
            return { success: false, message: '로그인 해주세요.' };
        }
        return await this.paymentService.confirmPayment(
            req.signedCookies.user,
            body.paymentKey,
            body.orderId,
            Number(body.amount),
        );
    }
}
