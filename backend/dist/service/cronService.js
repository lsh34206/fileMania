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
exports.cornService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const makeId_1 = require("../utils/makeId");
const dateUtils_1 = require("../utils/dateUtils");
const xpService_1 = require("./xpService");
const socket_1 = require("./socket");
const logService_1 = require("./logService");
let cornService = class cornService {
    xpService;
    socketService;
    logService;
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
    chatroomsModel;
    messagesModel;
    modelMap;
    constructor(xpService, socketService, logService, userModel, imageModel, audioModel, videoModel, appModel, documentModel, gymsModel, gymResultsModel, gymBidsModel, gymChatsModel, chatroomsModel, messagesModel) {
        this.xpService = xpService;
        this.socketService = socketService;
        this.logService = logService;
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
        this.chatroomsModel = chatroomsModel;
        this.messagesModel = messagesModel;
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
            chatrooms: this.chatroomsModel,
            messages: this.messagesModel
        };
    }
    async gymEndTimeCheck() {
        try {
            const now = new Date();
            const gyms = await this.gymsModel.find({ end_time: { $lte: now }, status: "active" });
            for (const gym of gyms) {
                if (gym.end_time < now) {
                    await this.gymsModel.updateOne({ _id: new mongoose_1.Types.ObjectId(gym._id) }, { $set: { status: "ended" } });
                    await this.gymResultsModel.insertOne({
                        auction_id: new mongoose_1.Types.ObjectId(gym._id),
                        winner_id: gym.highest_bidder_id ? new mongoose_1.Types.ObjectId(gym.highest_bidder_id) : null,
                        winner_name: gym.highest_bidder_name,
                        final_price: gym.highest_bidder_price,
                        seller_id: new mongoose_1.Types.ObjectId(gym.seller_id),
                        file_id: new mongoose_1.Types.ObjectId(gym.file_id),
                        file_type: gym.file_type
                    });
                    if (gym.highest_bidder_id) {
                        const user = await this.userModel.findOne({ _id: new mongoose_1.Types.ObjectId(gym.highest_bidder_id) });
                        await this.xpService.addXp(gym.highest_bidder_id.toString(), 15);
                        var userMessagesList = user?.massege_list ?? [];
                        userMessagesList.push({
                            id: makeId_1.makeIdUtils.makeId(),
                            message: `${gym.title} 경매에 낙찰되었습니다. 축하드립니다!\n 결제를 진행할 채팅방이 추가되었습니다.`,
                            sender_id: gym.seller_id,
                            sender_name: gym.seller_name,
                            receiver_id: gym.highest_bidder_id,
                            receiver_name: gym.highest_bidder_name,
                            createdAt: new Date()
                        });
                        await this.modelMap['chatrooms'].insertOne({
                            type: "경매",
                            auction_id: gym._id,
                            createAt: dateUtils_1.DateUtils.now_date(),
                            participants: [user._id, gym.seller_id]
                        });
                        await this.userModel.updateOne({ _id: new mongoose_1.Types.ObjectId(gym.seller_id) }, {
                            $set: {
                                massege_list: userMessagesList
                            }
                        });
                    }
                    this.socketService.notifyGymEnded(gym.file_id.toString(), {
                        winner_id: gym.highest_bidder_id ? gym.highest_bidder_id.toString() : null,
                        winner_name: gym.highest_bidder_name,
                        final_price: gym.highest_bidder_price,
                        title: gym.title
                    });
                    if (gym.highest_bidder_id) {
                        await this.logService.write('auction', `"${gym.title}" 경매가 종료되어 ${gym.highest_bidder_name}님이 ${gym.highest_bidder_price.toLocaleString()}원에 낙찰받았습니다.`, gym.highest_bidder_id.toString(), gym.highest_bidder_name, { auction_id: gym.file_id.toString() });
                    }
                    else {
                        await this.logService.write('auction', `"${gym.title}" 경매가 입찰자 없이 유찰되었습니다.`, null, '', { auction_id: gym.file_id.toString() });
                    }
                }
            }
            console.log("Gym end time check completed", gyms.length);
            return { success: true, message: "Gym end time check completed" };
        }
        catch (error) {
            console.log(error);
            return { success: false, message: error };
        }
    }
};
exports.cornService = cornService;
__decorate([
    (0, schedule_1.Cron)("*/1 * * * *"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], cornService.prototype, "gymEndTimeCheck", null);
exports.cornService = cornService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, mongoose_2.InjectModel)('users')),
    __param(4, (0, mongoose_2.InjectModel)('image')),
    __param(5, (0, mongoose_2.InjectModel)('audio')),
    __param(6, (0, mongoose_2.InjectModel)('video')),
    __param(7, (0, mongoose_2.InjectModel)('app')),
    __param(8, (0, mongoose_2.InjectModel)('document')),
    __param(9, (0, mongoose_2.InjectModel)('gyms')),
    __param(10, (0, mongoose_2.InjectModel)('gymResults')),
    __param(11, (0, mongoose_2.InjectModel)('gymBids')),
    __param(12, (0, mongoose_2.InjectModel)('gymChats')),
    __param(13, (0, mongoose_2.InjectModel)('chatrooms')),
    __param(14, (0, mongoose_2.InjectModel)('messages')),
    __metadata("design:paramtypes", [xpService_1.xpService,
        socket_1.socketService,
        logService_1.logService,
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
        mongoose_1.Model,
        mongoose_1.Model])
], cornService);
//# sourceMappingURL=cronService.js.map