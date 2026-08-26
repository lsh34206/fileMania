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
exports.downloadController = void 0;
const common_1 = require("@nestjs/common");
const auth_1 = require("../service/auth");
const download_1 = require("../service/download");
let downloadController = class downloadController {
    authService;
    downloadService;
    constructor(authService, downloadService) {
        this.authService = authService;
        this.downloadService = downloadService;
    }
    async download(req, type, id, res) {
        try {
            const result = await this.downloadService.download_file(type, id, req.cookies.user);
            if (!result.success || !result.path || !result.name) {
                return res.status(result.status ?? 404).json(result);
            }
            return res.download(result.path, result.name);
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
};
exports.downloadController = downloadController;
__decorate([
    (0, common_1.Get)("/:type/:id"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("type")),
    __param(2, (0, common_1.Param)("id")),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], downloadController.prototype, "download", null);
exports.downloadController = downloadController = __decorate([
    (0, common_1.Controller)("download_file"),
    __metadata("design:paramtypes", [auth_1.authService,
        download_1.downloadService])
], downloadController);
//# sourceMappingURL=downloadController.js.map