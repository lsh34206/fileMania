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
exports.messageService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
let messageService = class messageService {
    userModel;
    gymsModel;
    gymChatsModel;
    constructor(userModel, gymsModel, gymChatsModel) {
        this.userModel = userModel;
        this.gymsModel = gymsModel;
        this.gymChatsModel = gymChatsModel;
    }
    async message_main(userId) {
        const user = await this.userModel.findById(userId).select("name massege_list");
        if (!user) {
            return null;
        }
        const mailList = [...(user.massege_list ?? [])].reverse();
        const roomIds = await this.gymChatsModel.distinct("room_id", { sender_id: user._id });
        const chatRooms = await this.gymsModel.find({
            status: "active",
            $or: [
                { file_id: { $in: roomIds } },
                { seller_id: user._id },
                { highest_bidder_id: user._id },
            ],
        }).sort({ createdAt: -1 });
        const tradeRooms = await this.gymsModel.find({
            status: { $in: ["ended", "paid"] },
            $or: [
                { seller_id: user._id },
                { highest_bidder_id: user._id },
            ],
        }).sort({ end_time: -1 });
        return { name: user.name, mailList: mailList, chatRooms: chatRooms, tradeRooms: tradeRooms };
    }
    async deleteMail(userId, mailId) {
        const result = await this.userModel.updateOne({ _id: userId }, { $pull: { massege_list: { id: mailId } } });
        if (result.modifiedCount === 0) {
            return { success: false, message: '삭제할 우편을 찾을 수 없습니다.' };
        }
        return { success: true, message: '우편이 삭제되었습니다.' };
    }
};
exports.messageService = messageService;
exports.messageService = messageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)('users')),
    __param(1, (0, mongoose_2.InjectModel)('gyms')),
    __param(2, (0, mongoose_2.InjectModel)('gymChats')),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model])
], messageService);
//# sourceMappingURL=messageService.js.map