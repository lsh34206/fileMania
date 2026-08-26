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
exports.chatService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
let chatService = class chatService {
    userModel;
    gymsModel;
    gymChatsModel;
    chatroomsModel;
    messagesModel;
    constructor(userModel, gymsModel, gymChatsModel, chatroomsModel, messagesModel) {
        this.userModel = userModel;
        this.gymsModel = gymsModel;
        this.gymChatsModel = gymChatsModel;
        this.chatroomsModel = chatroomsModel;
        this.messagesModel = messagesModel;
    }
    async main_load(userId) {
        try {
            const user = await this.userModel.findById(userId);
            const user_id = user._id.toString();
            const chatList = await this.chatroomsModel.find({ participants: user_id }).sort({ last_message_time: -1 });
            return { success: true, message: '채팅 목록 로드 성공', data: {
                    name: user.name, userId: user_id, chatList: chatList
                } };
        }
        catch (error) {
            console.error(error);
            return { success: false, message: '채팅 목록 로드 실패' };
        }
    }
};
exports.chatService = chatService;
exports.chatService = chatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)('users')),
    __param(1, (0, mongoose_2.InjectModel)('gyms')),
    __param(2, (0, mongoose_2.InjectModel)('gymChats')),
    __param(3, (0, mongoose_2.InjectModel)('chatrooms')),
    __param(4, (0, mongoose_2.InjectModel)('messages')),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model])
], chatService);
//# sourceMappingURL=chatService.js.map