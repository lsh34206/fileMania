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
const multer_2 = __importDefault(require("multer"));
const path = __importStar(require("path"));
const fileUpload_1 = require("../service/fileUpload");
const imagePath = path.join(process.cwd(), 'files', 'image');
const videoPath = path.join(process.cwd(), 'files', 'video');
const audioPath = path.join(process.cwd(), 'files', 'audio');
const documentPath = path.join(process.cwd(), 'files', 'document');
const appPath = path.join(process.cwd(), 'files', 'app');
if (!fs_1.default.existsSync(imagePath)) {
    fs_1.default.mkdirSync(imagePath, { recursive: true });
}
if (!fs_1.default.existsSync(videoPath)) {
    fs_1.default.mkdirSync(videoPath, { recursive: true });
}
if (!fs_1.default.existsSync(audioPath)) {
    fs_1.default.mkdirSync(audioPath, { recursive: true });
}
if (!fs_1.default.existsSync(documentPath)) {
    fs_1.default.mkdirSync(documentPath, { recursive: true });
}
if (!fs_1.default.existsSync(appPath)) {
    fs_1.default.mkdirSync(appPath, { recursive: true });
}
const image_storage = multer_2.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, imagePath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const video_storage = multer_2.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, videoPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const audio_storage = multer_2.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, audioPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const document_storage = multer_2.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, documentPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const app_storage = multer_2.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, appPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
var upload_path = null;
const uploadByType = {
    image: (0, multer_2.default)({ storage: image_storage }).single('file'),
    video: (0, multer_2.default)({ storage: video_storage }).single('file'),
    audio: (0, multer_2.default)({ storage: audio_storage }).single('file'),
    document: (0, multer_2.default)({ storage: document_storage }).single('file'),
    app: (0, multer_2.default)({ storage: app_storage }).single('file'),
};
let fileController = class fileController {
    uploadService;
    constructor(uploadService) {
        this.uploadService = uploadService;
    }
    async upload(type, file, rawData, req) {
        const data = rawData
            ? JSON.parse(rawData)
            : { type, title: '', description: '', download_type: 'free' };
        const res = this.uploadService.uploadFile({
            file,
            data,
            userId: req.cookies.user,
            type,
        });
        return res;
    }
};
exports.fileController = fileController;
__decorate([
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                cb(null, path.join(process.cwd(), 'files', req.params.type));
            },
            filename: (req, file, cb) => {
                cb(null, `${Date.now()}-${file.originalname}`);
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