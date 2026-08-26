"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentController = void 0;
const common_1 = require("@nestjs/common");
const paymentService_1 = require("../service/paymentService");
let paymentController = class paymentController {
    paymentService;
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async createOrder(req, body) {
        if (!req.cookies.user) {
            return { success: false, message: '로그인 해주세요.' };
        }
        return await this.paymentService.createOrder(req.cookies.user, Number(body.amount));
    }
    async confirm(req, body) {
        if (!req.cookies.user) {
            return { success: false, message: '로그인 해주세요.' };
        }
        return await this.paymentService.confirmPayment(req.cookies.user, body.paymentKey, body.orderId, Number(body.amount));
    }
};
exports.paymentController = paymentController;
__decorate([
    (0, common_1.Post)("point/order"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], paymentController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Post)("point/confirm"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], paymentController.prototype, "confirm", null);
exports.paymentController = paymentController = __decorate([
    (0, common_1.Controller)("payment"),
    __metadata("design:paramtypes", [paymentService_1.paymentService])
], paymentController);
//# sourceMappingURL=paymentController.js.map