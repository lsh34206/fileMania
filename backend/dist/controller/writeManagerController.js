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
exports.writeManagerController = void 0;
const common_1 = require("@nestjs/common");
const auth_1 = require("../service/auth");
const writeManager_1 = require("../service/writeManager");
let writeManagerController = class writeManagerController {
    authService;
    writeManagerService;
    constructor(authService, writeManagerService) {
        this.authService = authService;
        this.writeManagerService = writeManagerService;
    }
    async login_auth(userid) {
        const name = await this.authService.login_Load(userid);
        if (name != null) {
            return name;
        }
        else {
            return '로그인 해주세요.';
        }
    }
    async writer_delete(req, download_type, type, id) {
        const ret = await this.writeManagerService.writer_delete(download_type, type, id, req.cookies.user);
        return { success: ret.success, message: ret.message };
    }
    async community_write(type, req, data) {
        const ret = await this.writeManagerService.community_write_ok(req.cookies.user, type, data);
        return { success: ret.success, message: ret.message };
    }
    async community_edit(type, id, req, data) {
        if (!req.cookies.user) {
            return { success: false, message: '로그인 해주세요.' };
        }
        const ret = await this.writeManagerService.community_edit_ok(req.cookies.user, id, type, data);
        return { success: ret.success, message: ret.message, category: ret.category };
    }
    async file_edit(type, id, req, data) {
        if (!req.cookies.user) {
            return { success: false, message: '로그인 해주세요.' };
        }
        const parsed = data ? JSON.parse(data) : {};
        const ret = await this.writeManagerService.file_edit_ok(req.cookies.user, type, id, parsed);
        return { success: ret.success, message: ret.message };
    }
};
exports.writeManagerController = writeManagerController;
__decorate([
    (0, common_1.Get)("/writer_delete/:download_type/:type/:id"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("download_type")),
    __param(2, (0, common_1.Param)("type")),
    __param(3, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], writeManagerController.prototype, "writer_delete", null);
__decorate([
    (0, common_1.Post)("/community/write_ok/:type"),
    __param(0, (0, common_1.Param)("type")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)("data")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], writeManagerController.prototype, "community_write", null);
__decorate([
    (0, common_1.Post)("/community/edit_ok/:type/:id"),
    __param(0, (0, common_1.Param)("type")),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Body)("data")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, String]),
    __metadata("design:returntype", Promise)
], writeManagerController.prototype, "community_edit", null);
__decorate([
    (0, common_1.Post)("/file_edit_ok/:type/:id"),
    __param(0, (0, common_1.Param)("type")),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Body)("data")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, String]),
    __metadata("design:returntype", Promise)
], writeManagerController.prototype, "file_edit", null);
exports.writeManagerController = writeManagerController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [auth_1.authService,
        writeManager_1.writeManagerService])
], writeManagerController);
//# sourceMappingURL=writeManagerController.js.map