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
exports.adminService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const socket_1 = require("./socket");
let adminService = class adminService {
    socketService;
    userModel;
    constructor(socketService, userModel) {
        this.socketService = socketService;
        this.userModel = userModel;
    }
    async requireAdmin(userId) {
        if (!userId) {
            return null;
        }
        const user = await this.userModel.findById(userId);
        if (!user || user.role !== 'admin') {
            return null;
        }
        return user;
    }
    async listUsers(adminId) {
        const admin = await this.requireAdmin(adminId);
        if (!admin) {
            return { success: false, message: '관리자 권한이 필요합니다.' };
        }
        const users = await this.userModel
            .find({})
            .select('name id email role status suspended_until suspend_reason ban_reason point level xp writer_count createdAt')
            .sort({ createdAt: -1 });
        return { success: true, users };
    }
    async banUser(adminId, targetId, reason) {
        const admin = await this.requireAdmin(adminId);
        if (!admin) {
            return { success: false, message: '관리자 권한이 필요합니다.' };
        }
        if (!mongoose_1.Types.ObjectId.isValid(targetId)) {
            return { success: false, message: '잘못된 요청입니다.' };
        }
        const target = await this.userModel.findById(targetId);
        if (!target) {
            return { success: false, message: '존재하지 않는 회원입니다.' };
        }
        if (target.role === 'admin') {
            return { success: false, message: '관리자는 차단할 수 없습니다.' };
        }
        await this.userModel.updateOne({ _id: target._id }, { $set: { status: 'banned', ban_reason: reason ?? '', suspended_until: null, suspend_reason: '' } });
        this.socketService.forceLogout(target._id.toString(), `차단된 계정입니다.${reason ? ` (사유: ${reason})` : ''}`);
        return { success: true, message: `${target.name}님을 차단했습니다.` };
    }
    async suspendUser(adminId, targetId, days, reason) {
        const admin = await this.requireAdmin(adminId);
        if (!admin) {
            return { success: false, message: '관리자 권한이 필요합니다.' };
        }
        if (!mongoose_1.Types.ObjectId.isValid(targetId)) {
            return { success: false, message: '잘못된 요청입니다.' };
        }
        if (!Number.isFinite(days) || days <= 0) {
            return { success: false, message: '정지 기간을 올바르게 입력해주세요.' };
        }
        const target = await this.userModel.findById(targetId);
        if (!target) {
            return { success: false, message: '존재하지 않는 회원입니다.' };
        }
        if (target.role === 'admin') {
            return { success: false, message: '관리자는 정지할 수 없습니다.' };
        }
        const until = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
        await this.userModel.updateOne({ _id: target._id }, { $set: { status: 'suspended', suspended_until: until, suspend_reason: reason ?? '' } });
        this.socketService.forceLogout(target._id.toString(), `정지된 계정입니다. (${until.toLocaleString('ko-KR')}까지)${reason ? ` 사유: ${reason}` : ''}`);
        return { success: true, message: `${target.name}님을 ${days}일간 정지했습니다.` };
    }
    async restoreUser(adminId, targetId) {
        const admin = await this.requireAdmin(adminId);
        if (!admin) {
            return { success: false, message: '관리자 권한이 필요합니다.' };
        }
        if (!mongoose_1.Types.ObjectId.isValid(targetId)) {
            return { success: false, message: '잘못된 요청입니다.' };
        }
        const target = await this.userModel.findById(targetId);
        if (!target) {
            return { success: false, message: '존재하지 않는 회원입니다.' };
        }
        await this.userModel.updateOne({ _id: target._id }, { $set: { status: 'active', suspended_until: null, suspend_reason: '', ban_reason: '' } });
        return { success: true, message: `${target.name}님의 제재를 해제했습니다.` };
    }
};
exports.adminService = adminService;
exports.adminService = adminService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_2.InjectModel)('users')),
    __metadata("design:paramtypes", [socket_1.socketService,
        mongoose_1.Model])
], adminService);
//# sourceMappingURL=adminService.js.map