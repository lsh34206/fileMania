import { Injectable } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { socketService } from "src/service/socket";

@Injectable()
export class adminService {
    constructor(
        private readonly socketService: socketService,

        @InjectModel('users')
        private readonly userModel: Model<any>,
    ) {}

    private async requireAdmin(userId: string) {
        if (!userId) {
            return null;
        }
        const user = await this.userModel.findById(userId);
        if (!user || user.role !== 'admin') {
            return null;
        }
        return user;
    }

    async listUsers(adminId: string) {
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

    async banUser(adminId: string, targetId: string, reason: string) {
        const admin = await this.requireAdmin(adminId);
        if (!admin) {
            return { success: false, message: '관리자 권한이 필요합니다.' };
        }
        if (!Types.ObjectId.isValid(targetId)) {
            return { success: false, message: '잘못된 요청입니다.' };
        }

        const target = await this.userModel.findById(targetId);
        if (!target) {
            return { success: false, message: '존재하지 않는 회원입니다.' };
        }
        if (target.role === 'admin') {
            return { success: false, message: '관리자는 차단할 수 없습니다.' };
        }

        await this.userModel.updateOne(
            { _id: target._id },
            { $set: { status: 'banned', ban_reason: reason ?? '', suspended_until: null, suspend_reason: '' } },
        );

        this.socketService.forceLogout(target._id.toString(), `차단된 계정입니다.${reason ? ` (사유: ${reason})` : ''}`);

        return { success: true, message: `${target.name}님을 차단했습니다.` };
    }

    async suspendUser(adminId: string, targetId: string, days: number, reason: string) {
        const admin = await this.requireAdmin(adminId);
        if (!admin) {
            return { success: false, message: '관리자 권한이 필요합니다.' };
        }
        if (!Types.ObjectId.isValid(targetId)) {
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
        await this.userModel.updateOne(
            { _id: target._id },
            { $set: { status: 'suspended', suspended_until: until, suspend_reason: reason ?? '' } },
        );

        this.socketService.forceLogout(target._id.toString(), `정지된 계정입니다. (${until.toLocaleString('ko-KR')}까지)${reason ? ` 사유: ${reason}` : ''}`);

        return { success: true, message: `${target.name}님을 ${days}일간 정지했습니다.` };
    }

    async restoreUser(adminId: string, targetId: string) {
        const admin = await this.requireAdmin(adminId);
        if (!admin) {
            return { success: false, message: '관리자 권한이 필요합니다.' };
        }
        if (!Types.ObjectId.isValid(targetId)) {
            return { success: false, message: '잘못된 요청입니다.' };
        }

        const target = await this.userModel.findById(targetId);
        if (!target) {
            return { success: false, message: '존재하지 않는 회원입니다.' };
        }

        await this.userModel.updateOne(
            { _id: target._id },
            { $set: { status: 'active', suspended_until: null, suspend_reason: '', ban_reason: '' } },
        );

        return { success: true, message: `${target.name}님의 제재를 해제했습니다.` };
    }
}
