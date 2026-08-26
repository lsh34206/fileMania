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
exports.purchaseController = void 0;
const common_1 = require("@nestjs/common");
const purchaseService_1 = require("../service/purchaseService");
let purchaseController = class purchaseController {
    purchaseService;
    constructor(purchaseService) {
        this.purchaseService = purchaseService;
    }
    async purchase(req, type, id) {
        if (!req.cookies.user) {
            return { success: false, message: '로그인 해주세요.' };
        }
        return await this.purchaseService.purchase(req.cookies.user, type, id);
    }
};
exports.purchaseController = purchaseController;
__decorate([
    (0, common_1.Post)(":type/:id"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("type")),
    __param(2, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], purchaseController.prototype, "purchase", null);
exports.purchaseController = purchaseController = __decorate([
    (0, common_1.Controller)("purchase"),
    __metadata("design:paramtypes", [purchaseService_1.purchaseService])
], purchaseController);
//# sourceMappingURL=purchaseController.js.map