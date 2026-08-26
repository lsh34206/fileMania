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
exports.writeManagerService = void 0;
const common_1 = require("@nestjs/common");
const path = __importStar(require("path"));
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const fs_1 = __importDefault(require("fs"));
const xpService_1 = require("./xpService");
let writeManagerService = class writeManagerService {
    xpService;
    userModel;
    imageModel;
    audioModel;
    videoModel;
    appModel;
    documentModel;
    gymsModel;
    gymResultsModel;
    gymBidsModel;
    gymChatsModel;
    community;
    modelMap;
    constructor(xpService, userModel, imageModel, audioModel, videoModel, appModel, documentModel, gymsModel, gymResultsModel, gymBidsModel, gymChatsModel, community) {
        this.xpService = xpService;
        this.userModel = userModel;
        this.imageModel = imageModel;
        this.audioModel = audioModel;
        this.videoModel = videoModel;
        this.appModel = appModel;
        this.documentModel = documentModel;
        this.gymsModel = gymsModel;
        this.gymResultsModel = gymResultsModel;
        this.gymBidsModel = gymBidsModel;
        this.gymChatsModel = gymChatsModel;
        this.community = community;
        this.modelMap = {
            users: this.userModel,
            image: this.imageModel,
            audio: this.audioModel,
            video: this.videoModel,
            document: this.documentModel,
            app: this.appModel,
            gyms: this.gymsModel,
            gymResults: this.gymResultsModel,
            gymBids: this.gymBidsModel,
            gymChats: this.gymChatsModel,
            community: this.community
        };
    }
    async community_write_ok(writer_id, type, data) {
        try {
            var collection = await this.modelMap["users"];
            const post_data = JSON.parse(data);
            const writer_info = await collection.findOne({ _id: new mongoose_1.Types.ObjectId(writer_id) });
            if (!writer_info) {
                return { success: false, message: "로그인 해주세요." };
            }
            if (type === 'notice' && writer_info.role !== 'admin') {
                return { success: false, message: "공지사항은 관리자만 작성할 수 있습니다." };
            }
            collection = await this.modelMap["community"];
            const write_ok = await collection.insertOne({ category: type, writer: writer_info.name, writer_id: writer_info._id, title: post_data.title, content: post_data.content });
            await this.userModel.updateOne({ _id: writer_info._id }, { $inc: { writer_count: 1 } });
            await this.xpService.addXp(writer_id, 3);
            return { success: true, message: "게시글 작성 완료" };
        }
        catch (err) {
            console.log(err);
            return { success: false, message: err.message };
        }
    }
    async community_edit_ok(writer_id, postId, type, data) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(postId)) {
                return { success: false, message: '잘못된 요청입니다.' };
            }
            if (!writer_id) {
                return { success: false, message: '로그인 해주세요.' };
            }
            const post_data = JSON.parse(data);
            if (!post_data.title || !post_data.title.trim()) {
                return { success: false, message: '제목을 입력해주세요.' };
            }
            if (!post_data.content || !post_data.content.trim()) {
                return { success: false, message: '내용을 입력해주세요.' };
            }
            const collection = this.modelMap["community"];
            const post = await collection.findOne({ _id: new mongoose_1.Types.ObjectId(postId), category: type });
            if (!post) {
                return { success: false, message: '게시글을 찾을 수 없습니다.' };
            }
            if (post.writer_id.toString() !== writer_id) {
                return { success: false, message: '수정 권한이 없습니다.' };
            }
            const newCategory = ['talk', 'share', 'question'].includes(post_data.category)
                ? post_data.category
                : post.category;
            await collection.updateOne({ _id: new mongoose_1.Types.ObjectId(postId), category: type }, { $set: { title: post_data.title, content: post_data.content, category: newCategory } });
            return { success: true, message: '게시글 수정 완료', category: newCategory };
        }
        catch (err) {
            console.log(err);
            return { success: false, message: err.message };
        }
    }
    async file_edit_ok(user_id, type, id, data) {
        try {
            if (!['image', 'video', 'audio', 'document', 'app'].includes(type)) {
                return { success: false, message: '잘못된 파일 종류입니다.' };
            }
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                return { success: false, message: '잘못된 요청입니다.' };
            }
            if (!user_id) {
                return { success: false, message: '로그인 해주세요.' };
            }
            const user = await this.userModel.findById(user_id);
            if (!user) {
                return { success: false, message: '로그인 해주세요.' };
            }
            if (!data.title || !String(data.title).trim()) {
                return { success: false, message: '제목을 입력해주세요.' };
            }
            if (!data.description || !String(data.description).trim()) {
                return { success: false, message: '설명을 입력해주세요.' };
            }
            const collection = this.modelMap[type];
            const file = await collection?.findOne({ _id: new mongoose_1.Types.ObjectId(id) });
            if (!file) {
                return { success: false, message: '파일을 찾을 수 없습니다.' };
            }
            if (file.uploader !== user.name) {
                return { success: false, message: '수정 권한이 없습니다.' };
            }
            const update = {
                title: data.title,
                description: data.description,
            };
            if (file.download_type === 'paid') {
                const price = Number(data.price);
                if (!Number.isFinite(price) || price < 0) {
                    return { success: false, message: '가격을 올바르게 입력해주세요.' };
                }
                update.price = price;
            }
            await collection.updateOne({ _id: new mongoose_1.Types.ObjectId(id) }, { $set: update });
            return { success: true, message: '파일 정보 수정 완료' };
        }
        catch (error) {
            console.log(error);
            return { success: false, message: error.message };
        }
    }
    async writer_delete(download_type, type, id, user_id) {
        try {
            if (!['image', 'video', 'audio', 'document', 'app'].includes(type)) {
                return { success: false, message: '잘못된 파일 종류입니다.' };
            }
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                return { success: false, message: '잘못된 요청입니다.' };
            }
            if (!user_id) {
                return { success: false, message: '로그인 해주세요.' };
            }
            const user = await this.userModel.findById(user_id);
            if (!user) {
                return { success: false, message: '로그인 해주세요.' };
            }
            var collection = this.modelMap[type];
            const file = await collection?.findOne({ _id: new mongoose_1.Types.ObjectId(id), download_type: download_type });
            if (!file) {
                return { success: false, message: '파일을 찾을 수 없습니다.' };
            }
            if (file.uploader !== user.name) {
                return { success: false, message: '삭제 권한이 없습니다.' };
            }
            const file_path = path.join("C:\\Users\\lsh34\\Web\\fileMania\\backend", file.path);
            if (fs_1.default.existsSync(file_path)) {
                fs_1.default.unlinkSync(file_path);
            }
            await collection?.deleteOne({ _id: new mongoose_1.Types.ObjectId(id), download_type: download_type });
            collection = this.modelMap['gyms'];
            await collection?.deleteOne({ file_id: new mongoose_1.Types.ObjectId(id), file_type: type });
            collection = this.modelMap['gymChats'];
            await collection?.deleteMany({ auction_id: new mongoose_1.Types.ObjectId(id) });
            collection = this.modelMap['gymBids'];
            await collection?.deleteMany({ auction_id: new mongoose_1.Types.ObjectId(id) });
            return { success: true, message: '파일 삭제 완료' };
        }
        catch (error) {
            console.log(error);
            return { success: false, message: error.message };
        }
    }
};
exports.writeManagerService = writeManagerService;
exports.writeManagerService = writeManagerService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_2.InjectModel)('users')),
    __param(2, (0, mongoose_2.InjectModel)('image')),
    __param(3, (0, mongoose_2.InjectModel)('audio')),
    __param(4, (0, mongoose_2.InjectModel)('video')),
    __param(5, (0, mongoose_2.InjectModel)('app')),
    __param(6, (0, mongoose_2.InjectModel)('document')),
    __param(7, (0, mongoose_2.InjectModel)('gyms')),
    __param(8, (0, mongoose_2.InjectModel)('gymResults')),
    __param(9, (0, mongoose_2.InjectModel)('gymBids')),
    __param(10, (0, mongoose_2.InjectModel)('gymChats')),
    __param(11, (0, mongoose_2.InjectModel)('community')),
    __metadata("design:paramtypes", [xpService_1.xpService,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model])
], writeManagerService);
//# sourceMappingURL=writeManager.js.map