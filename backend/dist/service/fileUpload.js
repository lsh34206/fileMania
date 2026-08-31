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
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const xpService_1 = require("./xpService");
let UploadService = class UploadService {
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
    modelMap;
    constructor(xpService, userModel, imageModel, audioModel, videoModel, appModel, documentModel, gymsModel, gymResultsModel, gymBidsModel, gymChatsModel) {
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
            gymChats: this.gymChatsModel
        };
    }
    async uploadFile({ file, data, userId, type, }) {
        const usersCollection = this.modelMap["users"];
        const uploaderUser = await usersCollection?.findOne({
            _id: new mongoose_1.Types.ObjectId(userId),
        });
        if (!uploaderUser) {
            throw new common_1.NotFoundException('유저 없음');
        }
        const filePath = `/files/${data.type}/${file.filename}`;
        const price = data.download_type === 'paid' ? data.price : 0;
        const start_price = data.download_type === 'gym' ? data.start_price : 0;
        const end_time = data.download_type === 'gym'
            ? new Date(Date.now() + data.end_time * 60 * 1000)
            : null;
        const targetCollection = this.modelMap[data.type];
        const result = await targetCollection.insertOne({
            download_type: data.download_type,
            download_count: 0,
            path: filePath,
            title: data.title,
            description: data.description,
            type: data.type,
            price,
            size: (file.size / (1024 * 1024)).toFixed(2) + 'MB',
            uploader: uploaderUser.name,
            start_price,
            end_time,
        });
        if (data.download_type === 'gym') {
            var collection = await this.modelMap["gyms"];
            collection.insertOne({ file_id: result._id,
                file_type: data.type,
                title: data.title,
                description: data.description,
                seller_id: uploaderUser._id,
                seller_name: uploaderUser.name,
                start_price: data.start_price,
                end_time: end_time,
            });
        }
        await this.xpService.addXp(userId, 3);
        return {
            success: true,
            message: '파일 업로드 완료',
        };
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
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
        mongoose_1.Model])
], UploadService);
//# sourceMappingURL=fileUpload.js.map