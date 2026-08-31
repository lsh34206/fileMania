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
exports.socketService = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const dateUtils_1 = require("../utils/dateUtils");
let socketService = class socketService {
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
    userSockets = new Map();
    socketUsers = new Map();
    gymRoomUsers = new Map();
    socketGymRooms = new Map();
    constructor(userModel, imageModel, audioModel, videoModel, appModel, documentModel, gymsModel, gymResultsModel, gymBidsModel, gymChatsModel, chatroomsModel, messagesModel) {
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
    server;
    extractUserId(client) {
        const cookieHeader = client.handshake.headers.cookie;
        if (!cookieHeader) {
            return null;
        }
        const match = cookieHeader
            .split(';')
            .map((c) => c.trim())
            .find((c) => c.startsWith('user='));
        if (!match) {
            return null;
        }
        return decodeURIComponent(match.split('=')[1]);
    }
    handleConnection(client) {
        const userId = this.extractUserId(client);
        if (!userId) {
            return;
        }
        if (!this.userSockets.has(userId)) {
            this.userSockets.set(userId, new Set());
        }
        this.userSockets.get(userId).add(client.id);
        this.socketUsers.set(client.id, userId);
    }
    handleDisconnect(client) {
        const userId = this.socketUsers.get(client.id);
        const gymRooms = this.socketGymRooms.get(client.id);
        if (gymRooms) {
            for (const gymId of [...gymRooms]) {
                this.removeGymPresence(client.id, gymId);
                this.broadcastGymRoomUsers(gymId);
            }
            this.socketGymRooms.delete(client.id);
        }
        if (userId) {
            const sockets = this.userSockets.get(userId);
            sockets?.delete(client.id);
            if (sockets && sockets.size === 0) {
                this.userSockets.delete(userId);
            }
        }
        this.socketUsers.delete(client.id);
    }
    forceLogout(userId, message) {
        const socketIds = this.userSockets.get(userId);
        if (!socketIds) {
            return;
        }
        for (const id of [...socketIds]) {
            this.server.to(id).emit('force_logout', { message });
            this.server.sockets.sockets.get(id)?.disconnect(true);
        }
    }
    async getOnlineUsers() {
        const userIds = [...this.userSockets.keys()];
        if (userIds.length === 0) {
            return [];
        }
        const users = await this.userModel.find({ _id: { $in: userIds } }).select('name level');
        return users.map((u) => ({ name: u.name, level: u.level ?? 1 }));
    }
    addGymPresence(gymId, userId, socketId) {
        if (!this.gymRoomUsers.has(gymId)) {
            this.gymRoomUsers.set(gymId, new Map());
        }
        const userMap = this.gymRoomUsers.get(gymId);
        if (!userMap.has(userId)) {
            userMap.set(userId, new Set());
        }
        userMap.get(userId).add(socketId);
        if (!this.socketGymRooms.has(socketId)) {
            this.socketGymRooms.set(socketId, new Set());
        }
        this.socketGymRooms.get(socketId).add(gymId);
    }
    removeGymPresence(socketId, gymId) {
        const userId = this.socketUsers.get(socketId);
        const userMap = this.gymRoomUsers.get(gymId);
        if (!userId || !userMap) {
            return;
        }
        const sockets = userMap.get(userId);
        if (!sockets) {
            return;
        }
        sockets.delete(socketId);
        if (sockets.size === 0) {
            userMap.delete(userId);
        }
        if (userMap.size === 0) {
            this.gymRoomUsers.delete(gymId);
        }
    }
    async broadcastGymRoomUsers(gymId) {
        const userMap = this.gymRoomUsers.get(gymId);
        const userIds = userMap ? [...userMap.keys()] : [];
        if (userIds.length === 0) {
            this.server.to(gymId).emit('receive_room_users', []);
            return;
        }
        const users = await this.userModel.find({ _id: { $in: userIds } }).select('name level');
        this.server.to(gymId).emit('receive_room_users', users.map((u) => ({ name: u.name, level: u.level ?? 1 })));
    }
    async joinGymRoom(data, client) {
        client.join(data.gymId);
        const userId = this.socketUsers.get(client.id) ?? data.userId;
        if (userId) {
            this.addGymPresence(data.gymId, userId, client.id);
        }
        this.server.to(data.gymId).emit('receive_system', {
            message: '입장했습니다.',
            time: new Date(),
        });
        await this.broadcastGymRoomUsers(data.gymId);
    }
    async sendChat(data) {
        const user = await this.userModel.findById(data.userId);
        const chat = await this.gymChatsModel.insertOne({
            auction_id: data.gymId,
            sender_id: user._id,
            sender_name: user.name,
            message: data.message,
            message_type: 'chat',
            room_id: data.gymId,
        });
        this.server.to(data.gymId).emit('receive_chat', chat);
    }
    async sendBid(data) {
        const gym = await this.gymsModel.findOne({ file_id: data.gymId });
        if (!gym || gym.status !== 'active') {
            return { success: false, message: '진행중인 경매가 아님' };
        }
        if (new Date(gym.end_time).getTime() < Date.now()) {
            return { success: false, message: '이미 종료된 경매임' };
        }
        if (data.bidPrice < gym.current_price + gym.min_bid_unit) {
            return { success: false, message: '입찰가가 너무 낮음' };
        }
        const user = await this.userModel.findById(data.userId);
        await this.gymsModel.updateOne({ file_id: data.gymId }, {
            $set: {
                current_price: data.bidPrice,
                highest_bidder_id: user._id,
                highest_bidder_price: data.bidPrice,
                highest_bidder_name: user.name,
            },
            $inc: { bid_count: 1 },
        });
        const bid = await this.gymBidsModel.insertOne({
            auction_id: data.gymId,
            bidder_id: user._id,
            bidder_name: user.name,
            bid_price: data.bidPrice,
            room_id: data.gymId,
        });
        const bidChat = await this.gymChatsModel.insertOne({
            auction_id: data.gymId,
            sender_id: user._id,
            sender_name: user.name,
            message: `${user.name}님이 ${data.bidPrice}원 입찰`,
            message_type: 'bid',
            bid_price: data.bidPrice,
            room_id: data.gymId,
        });
        this.server.to(data.gymId).emit('receive_bid', {
            bid,
            current_price: data.bidPrice,
            highest_bidder_name: user.name,
        });
        this.server.to(data.gymId).emit('receive_chat', bidChat);
        return { success: true };
    }
    async joinChatRoom(data, client) {
        const room = await this.chatroomsModel.findById(data.roomId);
        if (!room) {
            return { success: false, message: '존재하지 않는 채팅방입니다.' };
        }
        const isParticipant = room.participants.some((p) => p.toString() === data.userId);
        if (!isParticipant) {
            return { success: false, message: '참여중인 채팅방이 아닙니다.' };
        }
        client.join(`chat_${data.roomId}`);
        const users = await this.userModel
            .find({ _id: { $in: room.participants } })
            .select('name');
        const nameMap = {};
        for (const u of users) {
            nameMap[u._id.toString()] = u.name;
        }
        await this.messagesModel.updateMany({ room_id: room._id, sender_id: { $ne: data.userId }, isRead: false }, { $set: { isRead: true } });
        const messages = await this.messagesModel
            .find({ room_id: room._id })
            .sort({ createdAt: 1 });
        const history = messages.map((m) => ({
            ...m.toObject(),
            sender_name: nameMap[m.sender_id.toString()] ?? '알 수 없음',
        }));
        client.emit('chat_history', {
            room: room,
            participants: nameMap,
            messages: history,
        });
        return { success: true };
    }
    async sendMessage(data) {
        if (!data.message || !data.message.trim()) {
            return { success: false, message: '메시지를 입력해주세요.' };
        }
        const room = await this.chatroomsModel.findById(data.roomId);
        if (!room) {
            return { success: false, message: '존재하지 않는 채팅방입니다.' };
        }
        const user = await this.userModel.findById(data.userId);
        if (!user) {
            return { success: false, message: '로그인 해주세요.' };
        }
        const isParticipant = room.participants.some((p) => p.toString() === user._id.toString());
        if (!isParticipant) {
            return { success: false, message: '참여중인 채팅방이 아닙니다.' };
        }
        const msg = await this.messagesModel.insertOne({
            room_id: room._id,
            sender_id: user._id,
            content: data.message,
            createdAt: dateUtils_1.DateUtils.now_date(),
        });
        await this.chatroomsModel.updateOne({ _id: room._id }, {
            $set: {
                last_message: data.message,
                last_message_time: dateUtils_1.DateUtils.now_date(),
            },
        });
        this.server.to(`chat_${data.roomId}`).emit('receive_message', {
            ...msg.toObject(),
            sender_name: user.name,
        });
        return { success: true };
    }
};
exports.socketService = socketService;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], socketService.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_gym_room'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], socketService.prototype, "joinGymRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('send_chat'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], socketService.prototype, "sendChat", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('send_bid'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], socketService.prototype, "sendBid", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_chat_room'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], socketService.prototype, "joinChatRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('send_message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], socketService.prototype, "sendMessage", null);
exports.socketService = socketService = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: [process.env.FRONTEND_URI_VALUE],
            credentials: true
        },
    }),
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
    __param(10, (0, mongoose_2.InjectModel)('chatrooms')),
    __param(11, (0, mongoose_2.InjectModel)('messages')),
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
], socketService);
//# sourceMappingURL=socket.js.map