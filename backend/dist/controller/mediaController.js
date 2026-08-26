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
exports.mediaController = void 0;
const common_1 = require("@nestjs/common");
const download_1 = require("../service/download");
let mediaController = class mediaController {
    downloadService;
    constructor(downloadService) {
        this.downloadService = downloadService;
    }
    async serve(req, type, id, res) {
        const result = await this.downloadService.serve_file(type, id, req.cookies.user);
        if (!result.success || !result.path) {
            return res.status(result.status ?? 404).json(result);
        }
        return res.sendFile(result.path);
    }
    async preview(type, id, res) {
        const result = await this.downloadService.serve_preview(type, id);
        if (!result.success || !result.buffer) {
            return res.status(result.status ?? 404).json(result);
        }
        res.type("jpeg");
        return res.send(result.buffer);
    }
};
exports.mediaController = mediaController;
__decorate([
    (0, common_1.Get)(":type/:id"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("type")),
    __param(2, (0, common_1.Param)("id")),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], mediaController.prototype, "serve", null);
__decorate([
    (0, common_1.Get)(":type/:id/preview"),
    __param(0, (0, common_1.Param)("type")),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], mediaController.prototype, "preview", null);
exports.mediaController = mediaController = __decorate([
    (0, common_1.Controller)("media"),
    __metadata("design:paramtypes", [download_1.downloadService])
], mediaController);
//# sourceMappingURL=mediaController.js.map