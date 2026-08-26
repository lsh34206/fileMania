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
exports.listViewService = void 0;
const common_1 = require("@nestjs/common");
const dateUtils_1 = require("../utils/dateUtils");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
let listViewService = class listViewService {
    userModel;
    imageModel;
    audioModel;
    videoModel;
    appModel;
    documentModel;
    community;
    modelMap;
    constructor(userModel, imageModel, audioModel, videoModel, appModel, documentModel, community) {
        this.userModel = userModel;
        this.imageModel = imageModel;
        this.audioModel = audioModel;
        this.videoModel = videoModel;
        this.appModel = appModel;
        this.documentModel = documentModel;
        this.community = community;
        this.modelMap = {
            users: this.userModel,
            image: this.imageModel,
            audio: this.audioModel,
            video: this.videoModel,
            document: this.documentModel,
            app: this.appModel,
            community: this.community
        };
    }
    async attachUploaderLevel(files) {
        const uploaderNames = [...new Set(files.map(f => f.uploader))];
        const levelMap = {};
        if (uploaderNames.length > 0) {
            const uploaders = await this.userModel.find({ name: { $in: uploaderNames } }).select('name level');
            uploaders.forEach((u) => { levelMap[u.name] = u.level ?? 1; });
        }
        return files.map(f => {
            const plain = f.toObject ? f.toObject() : f;
            return { ...plain, uploader_level: levelMap[f.uploader] ?? 1 };
        });
    }
    async gym_view(type, name, keyword) {
        try {
            if (!['image', 'video', 'audio', 'document', 'app'].includes(type)) {
                return { files: [], id: [] };
            }
            var collection = await this.modelMap[type];
            const query = { download_type: 'gym', type };
            if (keyword && keyword.trim()) {
                query.title = { $regex: escapeRegex(keyword.trim()), $options: 'i' };
            }
            const rawFiles = await collection?.find(query);
            if (!rawFiles) {
                throw new common_1.BadRequestException("파일없음");
            }
            const id = rawFiles.map(f => new mongoose_1.Types.ObjectId(f._id));
            const end_time = rawFiles.map(f => dateUtils_1.DateUtils.date_to_string(f.end_time));
            const start_price = rawFiles.map(f => f.start_price);
            const files = await this.attachUploaderLevel(rawFiles);
            return { files, id, name: name, end_time: dateUtils_1.DateUtils.date_to_string(end_time), start_price: start_price };
        }
        catch (error) {
            console.log(error);
            return { success: false, message: error };
        }
    }
    async free_view(type, name, keyword) {
        try {
            if (!['image', 'video', 'audio', 'document', 'app'].includes(type)) {
                return { files: [], id: [], writer_is_me: [] };
            }
            var collection = this.modelMap[type];
            const query = { download_type: 'free', type };
            if (keyword && keyword.trim()) {
                query.title = { $regex: escapeRegex(keyword.trim()), $options: 'i' };
            }
            const rawFiles = await collection?.find(query);
            if (!rawFiles) {
                throw new common_1.BadRequestException("파일없음");
            }
            const id = rawFiles.map(f => new mongoose_1.Types.ObjectId(f._id));
            const writer_is_me = rawFiles.map(f => name !== '로그인 해주세요.' && f.uploader === name);
            const files = await this.attachUploaderLevel(rawFiles);
            return { files: files, id: id, name: name, writer_is_me: writer_is_me };
        }
        catch (error) {
            console.log(error);
            return { success: false, message: error };
        }
    }
    async paid_view(type, name, keyword) {
        try {
            if (!['image', 'video', 'audio', 'document', 'app'].includes(type)) {
                return { files: [], id: [], name, writer_is_me: [] };
            }
            const collection = this.modelMap[type];
            const query = { download_type: 'paid', type };
            if (keyword && keyword.trim()) {
                query.title = { $regex: escapeRegex(keyword.trim()), $options: 'i' };
            }
            const rawFiles = await collection
                .find(query)
                .exec();
            const id = rawFiles.map((f) => f._id.toString());
            const writer_is_me = rawFiles.map((f) => name !== '로그인 해주세요.' && f.uploader === name);
            const files = await this.attachUploaderLevel(rawFiles);
            return { files, id, name, writer_is_me };
        }
        catch (error) {
            console.log(error);
            return { success: false, message: error.message };
        }
    }
    async community_list_view(type, name, keyword, sort) {
        try {
            var collection = await this.modelMap["community"];
            const query = { category: type };
            if (keyword && keyword.trim()) {
                const escaped = escapeRegex(keyword.trim());
                query.$or = [
                    { title: { $regex: escaped, $options: 'i' } },
                    { content: { $regex: escaped, $options: 'i' } },
                ];
            }
            const sortMap = {
                latest: { createdAt: -1 },
                likes: { like_count: -1, createdAt: -1 },
                comments: { comment_count: -1, createdAt: -1 },
                views: { view_count: -1, createdAt: -1 },
            };
            const sortOption = sortMap[sort ?? 'latest'] ?? sortMap.latest;
            const list = await collection.find(query).sort(sortOption).exec();
            return { list: list, name: name, message: "불러오기 성공" };
        }
        catch (error) {
            return { message: error, name: name };
        }
    }
    async featured_post() {
        try {
            const collection = this.modelMap["community"];
            const notice = await collection.findOne({ category: 'notice' }).sort({ createdAt: -1 });
            if (notice) {
                return { post: notice, kind: 'notice' };
            }
            const popular = await collection.aggregate([
                { $addFields: { score: { $add: [{ $ifNull: ['$like_count', 0] }, { $ifNull: ['$comment_count', 0] }] } } },
                { $sort: { score: -1, createdAt: -1 } },
                { $limit: 1 },
            ]);
            return { post: popular[0] ?? null, kind: popular[0] ? 'popular' : null };
        }
        catch (error) {
            console.log(error);
            return { post: null, kind: null };
        }
    }
};
exports.listViewService = listViewService;
exports.listViewService = listViewService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)('users')),
    __param(1, (0, mongoose_2.InjectModel)('image')),
    __param(2, (0, mongoose_2.InjectModel)('audio')),
    __param(3, (0, mongoose_2.InjectModel)('video')),
    __param(4, (0, mongoose_2.InjectModel)('app')),
    __param(5, (0, mongoose_2.InjectModel)('document')),
    __param(6, (0, mongoose_2.InjectModel)('community')),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model])
], listViewService);
//# sourceMappingURL=listView.js.map