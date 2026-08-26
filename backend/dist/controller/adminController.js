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
exports.adminController = void 0;
const common_1 = require("@nestjs/common");
const adminService_1 = require("../service/adminService");
let adminController = class adminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    async listUsers(req) {
        return await this.adminService.listUsers(req.cookies.user);
    }
    async ban(req, id, reason) {
        return await this.adminService.banUser(req.cookies.user, id, reason);
    }
    async suspend(req, id, days, reason) {
        return await this.adminService.suspendUser(req.cookies.user, id, Number(days), reason);
    }
    async restore(req, id) {
        return await this.adminService.restoreUser(req.cookies.user, id);
    }
};
exports.adminController = adminController;
__decorate([
    (0, common_1.Get)("users"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], adminController.prototype, "listUsers", null);
__decorate([
    (0, common_1.Post)("users/:id/ban"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)("reason")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], adminController.prototype, "ban", null);
__decorate([
    (0, common_1.Post)("users/:id/suspend"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)("days")),
    __param(3, (0, common_1.Body)("reason")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number, String]),
    __metadata("design:returntype", Promise)
], adminController.prototype, "suspend", null);
__decorate([
    (0, common_1.Post)("users/:id/restore"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], adminController.prototype, "restore", null);
exports.adminController = adminController = __decorate([
    (0, common_1.Controller)("admin"),
    __metadata("design:paramtypes", [adminService_1.adminService])
], adminController);
//# sourceMappingURL=adminController.js.map