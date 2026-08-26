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
exports.downloadService = void 0;
const common_1 = require("@nestjs/common");
const path = __importStar(require("path"));
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const fs = __importStar(require("fs"));
const sharp_1 = __importDefault(require("sharp"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const ffmpeg_static_1 = __importDefault(require("ffmpeg-static"));
if (ffmpeg_static_1.default) {
    fluent_ffmpeg_1.default.setFfmpegPath(ffmpeg_static_1.default);
}
let downloadService = class downloadService {
    userModel;
    imageModel;
    audioModel;
    videoModel;
    appModel;
    documentModel;
    purchaseModel;
    modelMap;
    constructor(userModel, imageModel, audioModel, videoModel, appModel, documentModel, purchaseModel) {
        this.userModel = userModel;
        this.imageModel = imageModel;
        this.audioModel = audioModel;
        this.videoModel = videoModel;
        this.appModel = appModel;
        this.documentModel = documentModel;
        this.purchaseModel = purchaseModel;
        this.modelMap = {
            users: this.userModel,
            image: this.imageModel,
            audio: this.audioModel,
            video: this.videoModel,
            document: this.documentModel,
            app: this.appModel
        };
    }
    async checkAccess(doc, userId) {
        if (doc.download_type !== 'paid') {
            return true;
        }
        if (!userId) {
            return false;
        }
        const user = await this.userModel.findById(userId);
        if (!user) {
            return false;
        }
        if (doc.uploader === user.name) {
            return true;
        }
        const purchase = await this.purchaseModel.findOne({ user_id: user._id, file_id: doc._id });
        return !!purchase;
    }
    async serve_file(type, id, userId) {
        try {
            if (!this.modelMap[type]) {
                return { success: false, message: "invalid type" };
            }
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                return { success: false, message: "invalid id" };
            }
            const collection = this.modelMap[type];
            const doc = await collection.findOne({ _id: new mongoose_1.Types.ObjectId(id) });
            if (!doc) {
                return { success: false, message: "not found" };
            }
            const allowed = await this.checkAccess(doc, userId);
            if (!allowed) {
                return { success: false, message: "구매 후 이용 가능합니다.", status: 403 };
            }
            const abs = path.join(process.cwd(), "files", type, path.basename(doc.path));
            if (!fs.existsSync(abs)) {
                return { success: false, message: "file not found" };
            }
            return { success: true, path: abs };
        }
        catch (e) {
            console.log(e);
            return { success: false, message: "serve failed" };
        }
    }
    extractVideoFrame(abs, time) {
        return new Promise((resolve, reject) => {
            const chunks = [];
            (0, fluent_ffmpeg_1.default)(abs)
                .seekInput(time)
                .frames(1)
                .format("image2")
                .outputOptions("-vcodec", "mjpeg")
                .on("error", reject)
                .pipe()
                .on("data", (chunk) => chunks.push(chunk))
                .on("end", () => resolve(Buffer.concat(chunks)));
        });
    }
    async serve_preview(type, id) {
        try {
            if (type !== "image" && type !== "video") {
                return { success: false, message: "preview not supported", status: 404 };
            }
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                return { success: false, message: "invalid id" };
            }
            const collection = this.modelMap[type];
            const doc = await collection.findOne({ _id: new mongoose_1.Types.ObjectId(id) });
            if (!doc) {
                return { success: false, message: "not found" };
            }
            const abs = path.join(process.cwd(), "files", type, path.basename(doc.path));
            if (!fs.existsSync(abs)) {
                return { success: false, message: "file not found" };
            }
            let source = abs;
            if (type === "video") {
                try {
                    source = await this.extractVideoFrame(abs, "00:00:01");
                }
                catch {
                    source = await this.extractVideoFrame(abs, "00:00:00");
                }
            }
            const buffer = await (0, sharp_1.default)(source)
                .resize({ width: 32 })
                .blur(12)
                .jpeg({ quality: 40 })
                .toBuffer();
            return { success: true, buffer };
        }
        catch (e) {
            console.log(e);
            return { success: false, message: "preview failed" };
        }
    }
    async download_file(type, id, userId) {
        try {
            console.log("type:", type);
            console.log("id:", id);
            if (!this.modelMap[type]) {
                return { success: false, message: "invalid type" };
            }
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                return { success: false, message: "invalid id" };
            }
            const collection = this.modelMap[type];
            const doc = await collection.findOne({
                _id: new mongoose_1.Types.ObjectId(id),
            });
            if (!doc) {
                return { success: false, message: "not found" };
            }
            const allowed = await this.checkAccess(doc, userId);
            if (!allowed) {
                return { success: false, message: "구매 후 이용 가능합니다.", status: 403 };
            }
            const originalBase = path.basename(doc.path);
            const ext = path.extname(originalBase) || "";
            const safeTitle = (doc.title || path.basename(originalBase, ext))
                .replace(/[\\/:*?"<>|]/g, "_");
            const downloadName = `${safeTitle}${ext}`;
            const abs = path.join(process.cwd(), "files", type, originalBase);
            console.log("abs:", abs);
            if (!fs.existsSync(abs)) {
                return { success: false, message: "file not found" };
            }
            await collection.updateOne({ _id: doc._id }, { $inc: { download_count: 1 } });
            return {
                success: true,
                message: "download success",
                path: abs,
                name: downloadName,
            };
        }
        catch (e) {
            console.log(e);
            return { success: false, message: "download failed" };
        }
    }
};
exports.downloadService = downloadService;
exports.downloadService = downloadService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)('users')),
    __param(1, (0, mongoose_2.InjectModel)('image')),
    __param(2, (0, mongoose_2.InjectModel)('audio')),
    __param(3, (0, mongoose_2.InjectModel)('video')),
    __param(4, (0, mongoose_2.InjectModel)('app')),
    __param(5, (0, mongoose_2.InjectModel)('document')),
    __param(6, (0, mongoose_2.InjectModel)('purchases')),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model])
], downloadService);
//# sourceMappingURL=download.js.map