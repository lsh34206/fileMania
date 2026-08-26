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
exports.chatController = void 0;
const common_1 = require("@nestjs/common");
const chatService_1 = require("../service/chatService");
const auth_1 = require("../service/auth");
let chatController = class chatController {
    chatService;
    authService;
    constructor(chatService, authService) {
        this.chatService = chatService;
        this.authService = authService;
    }
    async login_auth(userid) {
        const name = await this.authService.login_Load(userid);
        if (name != null) {
            return name;
        }
        else {
            return '로그인 해주세요.';
        }
    }
    async chat_main(req) {
        if (!req.cookies.user) {
            return { name: null };
        }
        const name = await this.login_auth(req.cookies.user);
        if (name === '로그인 해주세요.') {
            return { name: null };
        }
        const ret = await this.chatService.main_load(req.cookies.user);
        if (ret === null) {
            return { name: null };
        }
        return { data: ret, name: name };
    }
    async chat_room(req, room_id) {
        if (!req.cookies.user) {
            return { name: null };
        }
    }
};
exports.chatController = chatController;
__decorate([
    (0, common_1.Get)("/chat"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], chatController.prototype, "chat_main", null);
__decorate([
    (0, common_1.Get)("/chat/:room_id"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("room_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], chatController.prototype, "chat_room", null);
exports.chatController = chatController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [chatService_1.chatService, auth_1.authService])
], chatController);
//# sourceMappingURL=chatController.js.map