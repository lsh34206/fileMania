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
exports.ViewService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
let ViewService = class ViewService {
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
    purchaseModel;
    modelMap;
    constructor(userModel, imageModel, audioModel, videoModel, appModel, documentModel, gymsModel, gymResultsModel, gymBidsModel, gymChatsModel, community, purchaseModel) {
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
        this.purchaseModel = purchaseModel;
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
    async view_file(download_type, type, id, user_id) {
        try {
            var collection = await this.userModel;
            const name = user_id ? await collection?.findOne({ _id: new mongoose_1.Types.ObjectId(user_id) }) : null;
            console.log(name);
            collection = await this.modelMap[type];
            console.log(type);
            const file = await collection?.findOne({ _id: new mongoose_1.Types.ObjectId(id), download_type: download_type });
            console.log(file);
            const writer_is_me = !!name?.name && !!file && file.uploader === name.name;
            console.log(writer_is_me);
            let purchased = true;
            if (download_type === 'paid' && file) {
                if (writer_is_me) {
                    purchased = true;
                }
                else if (user_id) {
                    const purchase = await this.purchaseModel.findOne({ user_id: new mongoose_1.Types.ObjectId(user_id), file_id: file._id });
                    purchased = !!purchase;
                }
                else {
                    purchased = false;
                }
            }
            return { file: file, name: name?.name ?? null, writer_is_me: writer_is_me, id: id, purchased: purchased };
        }
        catch (error) {
            console.log(error);
            return { success: false, message: error.message };
        }
    }
    async gym_view(download_type, type, id, user_id) {
        try {
            var collection = await this.userModel;
            const name = user_id ? await collection?.findOne({ _id: new mongoose_1.Types.ObjectId(user_id) }) : null;
            console.log(name);
            collection = await this.modelMap[type];
            console.log(type);
            const file = await collection?.findOne({ _id: new mongoose_1.Types.ObjectId(id), download_type: download_type });
            console.log(file);
            const writer_is_me = !!name?.name && !!file && file.uploader === name.name;
            console.log(writer_is_me);
            collection = await this.modelMap["gymChats"];
            const chatsList = await collection.find({ auction_id: file._id.toString() });
            collection = await this.modelMap["gymBids"];
            const bidsList = await collection.find({ auction_id: file._id.toString() });
            collection = await this.modelMap["gyms"];
            const gym = await collection.findOne({ file_id: file._id });
            return { file: file, name: name?.name ?? null, writer_is_me: writer_is_me, id: id, user_id: user_id, chatList: chatsList, bidsList: bidsList, gym: gym };
        }
        catch (error) {
            console.log(error);
            return { success: false, message: error.message };
        }
    }
    async community_post_writer_is_me(viewer, postId, type) {
        try {
            var collection = await this.modelMap["community"];
            const post = await collection.findOne({ _id: new mongoose_1.Types.ObjectId(postId), category: type });
            const uploader = (post.writer_id).toString();
            return viewer === uploader;
        }
        catch (error) {
            console.log(error);
        }
    }
    async is_admin(viewer) {
        if (!viewer) {
            return false;
        }
        try {
            const user = await this.userModel.findById(viewer).select('role');
            return user?.role === 'admin';
        }
        catch (error) {
            return false;
        }
    }
    async community_post_count_view(type, id, name, viewer) {
        try {
            var collection = await this.modelMap["community"];
            const post = await collection.findOne({ _id: new mongoose_1.Types.ObjectId(id), category: type });
            const update = await collection.updateOne({ _id: new mongoose_1.Types.ObjectId(id), category: type }, { $inc: { view_count: 1 } });
            const post_writer_is_me = await this.community_post_writer_is_me(viewer, id, type);
            const is_admin = await this.is_admin(viewer);
            return { post: post, name: name, writer_is_me: post_writer_is_me, is_admin: is_admin, message: "불러오기 성공" };
        }
        catch (error) {
            return { message: error, name: name };
        }
    }
    async community_post_view(type, id, name, viewer) {
        try {
            var collection = await this.modelMap["community"];
            const post = await collection.findOne({ _id: new mongoose_1.Types.ObjectId(id), category: type });
            const post_writer_is_me = await this.community_post_writer_is_me(viewer, id, type);
            const is_admin = await this.is_admin(viewer);
            return { post: post, name: name, writer_is_me: post_writer_is_me, is_admin: is_admin, message: "불러오기 성공" };
        }
        catch (error) {
            return { message: error, name: name };
        }
    }
};
exports.ViewService = ViewService;
exports.ViewService = ViewService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)('users')),
    __param(1, (0, mongoose_2.InjectModel)('image')),
    __param(2, (0, mongoose_2.InjectModel)('audio')),
    __param(3, (0, mongoose_2.InjectModel)('video')),
    __param(4, (0, mongoose_2.InjectModel)('app')),
    __param(5, (0, mongoose_2.InjectModel)('document')),
    __param(6, (0, mongoose_2.InjectModel)('gyms')),
    __param(7, (0, mongoose_2.InjectModel)('gymResults')),
    __param(8, (0, mongoose_2.InjectModel)('gymBids')),
    __param(9, (0, mongoose_2.InjectModel)('gymChats')),
    __param(10, (0, mongoose_2.InjectModel)('community')),
    __param(11, (0, mongoose_2.InjectModel)('purchases')),
    __metadata("design:paramtypes", [mongoose_1.Model,
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
], ViewService);
//# sourceMappingURL=view.js.map