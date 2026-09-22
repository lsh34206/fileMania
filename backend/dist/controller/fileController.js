"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const fs_1 = __importDefault(require("fs"));
const multer_1 = require("multer");
const path = __importStar(require("path"));
const crypto = __importStar(require("crypto"));
const fileUpload_1 = require("../service/fileUpload");
const ALLOWED_TYPES = ['image', 'video', 'audio', 'document', 'app'];
for (const type of ALLOWED_TYPES) {
    const dir = path.join(process.cwd(), 'files', type);
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
}
let fileController = class fileController {
    uploadService;
    constructor(uploadService) {
        this.uploadService = uploadService;
    }
    async upload(type, file, rawData, req) {
        if (!ALLOWED_TYPES.includes(type)) {
            return { success: false, message: '잘못된 파일 종류입니다.' };
        }
        const data = rawData
            ? JSON.parse(rawData)
            : { type, title: '', description: '', download_type: 'free' };
        const res = this.uploadService.uploadFile({
            file,
            data,
            userId: req.signedCookies.user,
            type,
        });
        return res;
    }
};
exports.fileController = fileController;
__decorate([
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        limits: { fileSize: 500 * 1024 * 1024 },
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                if (!ALLOWED_TYPES.includes(req.params.type)) {
                    return cb(new common_1.BadRequestException('잘못된 파일 종류입니다.'), '');
                }
                cb(null, path.join(process.cwd(), 'files', req.params.type));
            },
            filename: (req, file, cb) => {
                const ext = path.extname(file.originalname).replace(/[^a-zA-Z0-9.]/g, '').slice(0, 20);
                cb(null, `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`);
            },
        }),
    })),
    (0, common_1.Post)("/file_upload_ok/:type"),
    __param(0, (0, common_1.Param)('type')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)('data')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, Object]),
    __metadata("design:returntype", Promise)
], fileController.prototype, "upload", null);
exports.fileController = fileController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [fileUpload_1.UploadService])
], fileController);
//# sourceMappingURL=fileController.js.map