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
exports.paymentService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const makeId_1 = require("../utils/makeId");
const dateUtils_1 = require("../utils/dateUtils");
const xpService_1 = require("./xpService");
const MIN_CHARGE_AMOUNT = 1000;
const MAX_CHARGE_AMOUNT = 1000000;
let paymentService = class paymentService {
    xpService;
    userModel;
    pointChargeModel;
    constructor(xpService, userModel, pointChargeModel) {
        this.xpService = xpService;
        this.userModel = userModel;
        this.pointChargeModel = pointChargeModel;
    }
    async createOrder(userId, amount) {
        if (!Number.isInteger(amount) || amount < MIN_CHARGE_AMOUNT) {
            return { success: false, message: `충전 금액은 ${MIN_CHARGE_AMOUNT.toLocaleString()}원 이상이어야 합니다.` };
        }
        if (amount > MAX_CHARGE_AMOUNT) {
            return { success: false, message: `1회 충전 한도는 ${MAX_CHARGE_AMOUNT.toLocaleString()}원입니다.` };
        }
        const user = await this.userModel.findById(userId).select('name');
        if (!user) {
            return { success: false, message: '로그인 해주세요.' };
        }
        const orderId = `point_${makeId_1.makeIdUtils.makeId()}`;
        await this.pointChargeModel.insertOne({
            order_id: orderId,
            user_id: user._id,
            amount,
            status: 'ready',
        });
        return {
            success: true,
            orderId,
            amount,
            orderName: `포인트 ${amount.toLocaleString()}P 충전`,
            customerName: user.name,
        };
    }
    async confirmPayment(userId, paymentKey, orderId, amount) {
        if (!paymentKey || !orderId || !Number.isInteger(amount)) {
            return { success: false, message: '잘못된 요청입니다.' };
        }
        const charge = await this.pointChargeModel.findOne({ order_id: orderId });
        if (!charge) {
            return { success: false, message: '존재하지 않는 주문입니다.' };
        }
        if (charge.user_id.toString() !== userId) {
            return { success: false, message: '본인의 주문이 아닙니다.' };
        }
        if (charge.status === 'paid') {
            return { success: true, message: '이미 처리된 결제입니다.' };
        }
        if (charge.status !== 'ready') {
            return { success: false, message: '처리할 수 없는 주문 상태입니다.' };
        }
        if (charge.amount !== amount) {
            return { success: false, message: '결제 금액이 일치하지 않습니다.' };
        }
        const secretKey = process.env.TOSS_SECRET_KEY;
        if (!secretKey) {
            console.error('TOSS_SECRET_KEY가 설정되어 있지 않습니다.');
            return { success: false, message: '결제 설정 오류입니다. 관리자에게 문의해주세요.' };
        }
        let tossRes;
        try {
            tossRes = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ paymentKey, orderId, amount }),
            });
        }
        catch (error) {
            console.error(error);
            return { success: false, message: '결제 서버 통신에 실패했습니다.' };
        }
        const tossData = await tossRes.json();
        if (!tossRes.ok) {
            await this.pointChargeModel.updateOne({ order_id: orderId }, { $set: { status: 'failed' } });
            return { success: false, message: tossData.message ?? '결제 승인에 실패했습니다.' };
        }
        await this.pointChargeModel.updateOne({ order_id: orderId }, {
            $set: {
                status: 'paid',
                payment_key: paymentKey,
                method: tossData.method ?? '',
                approved_at: tossData.approvedAt ?? dateUtils_1.DateUtils.now_date(),
            },
        });
        const user = await this.userModel.findByIdAndUpdate(charge.user_id, { $inc: { point: amount } }, { new: true }).select('point');
        await this.xpService.addXp(charge.user_id.toString(), 30);
        return { success: true, message: '충전이 완료되었습니다.', point: user?.point ?? 0 };
    }
};
exports.paymentService = paymentService;
exports.paymentService = paymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_2.InjectModel)('users')),
    __param(2, (0, mongoose_2.InjectModel)('pointCharges')),
    __metadata("design:paramtypes", [xpService_1.xpService,
        mongoose_1.Model,
        mongoose_1.Model])
], paymentService);
//# sourceMappingURL=paymentService.js.map