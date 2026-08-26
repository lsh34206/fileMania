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
exports.purchaseService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const xpService_1 = require("./xpService");
let purchaseService = class purchaseService {
    xpService;
    userModel;
    imageModel;
    audioModel;
    videoModel;
    appModel;
    documentModel;
    purchaseModel;
    modelMap;
    constructor(xpService, userModel, imageModel, audioModel, videoModel, appModel, documentModel, purchaseModel) {
        this.xpService = xpService;
        this.userModel = userModel;
        this.imageModel = imageModel;
        this.audioModel = audioModel;
        this.videoModel = videoModel;
        this.appModel = appModel;
        this.documentModel = documentModel;
        this.purchaseModel = purchaseModel;
        this.modelMap = {
            image: this.imageModel,
            audio: this.audioModel,
            video: this.videoModel,
            document: this.documentModel,
            app: this.appModel,
        };
    }
    async purchase(userId, type, id) {
        if (!this.modelMap[type]) {
            return { success: false, message: '잘못된 파일 종류입니다.' };
        }
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            return { success: false, message: '잘못된 요청입니다.' };
        }
        const user = await this.userModel.findById(userId);
        if (!user) {
            return { success: false, message: '로그인 해주세요.' };
        }
        const collection = this.modelMap[type];
        const file = await collection.findOne({ _id: new mongoose_1.Types.ObjectId(id), download_type: 'paid' });
        if (!file) {
            return { success: false, message: '존재하지 않는 파일입니다.' };
        }
        if (file.uploader === user.name) {
            return { success: false, message: '본인이 업로드한 파일입니다.' };
        }
        const already = await this.purchaseModel.findOne({ user_id: user._id, file_id: file._id });
        if (already) {
            return { success: true, message: '이미 구매한 파일입니다.' };
        }
        if ((user.point ?? 0) < file.price) {
            return { success: false, message: '포인트가 부족합니다.' };
        }
        await this.userModel.updateOne({ _id: user._id }, { $inc: { point: -file.price } });
        try {
            await this.purchaseModel.insertOne({
                user_id: user._id,
                file_id: file._id,
                file_type: type,
                price: file.price,
            });
        }
        catch (error) {
            await this.userModel.updateOne({ _id: user._id }, { $inc: { point: file.price } });
            return { success: true, message: '이미 구매한 파일입니다.' };
        }
        const seller = await this.userModel.findOne({ name: file.uploader });
        if (seller) {
            await this.userModel.updateOne({ _id: seller._id }, { $inc: { point: file.price } });
        }
        await this.xpService.addXp(user._id.toString(), 5);
        const updatedUser = await this.userModel.findById(user._id).select('point');
        return { success: true, message: '구매가 완료되었습니다.', point: updatedUser?.point ?? 0 };
    }
};
exports.purchaseService = purchaseService;
exports.purchaseService = purchaseService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_2.InjectModel)('users')),
    __param(2, (0, mongoose_2.InjectModel)('image')),
    __param(3, (0, mongoose_2.InjectModel)('audio')),
    __param(4, (0, mongoose_2.InjectModel)('video')),
    __param(5, (0, mongoose_2.InjectModel)('app')),
    __param(6, (0, mongoose_2.InjectModel)('document')),
    __param(7, (0, mongoose_2.InjectModel)('purchases')),
    __metadata("design:paramtypes", [xpService_1.xpService,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model])
], purchaseService);
//# sourceMappingURL=purchaseService.js.map