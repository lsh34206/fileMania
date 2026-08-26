import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { makeIdUtils } from "src/utils/makeId";
import { DateUtils } from "src/utils/dateUtils";
import { xpService } from "src/service/xpService";

const MIN_CHARGE_AMOUNT = 1000;
const MAX_CHARGE_AMOUNT = 1000000;

@Injectable()
export class paymentService {
    constructor(
        private readonly xpService: xpService,

        @InjectModel('users')
        private readonly userModel: Model<any>,

        @InjectModel('pointCharges')
        private readonly pointChargeModel: Model<any>,
    ) {}

    async createOrder(userId: string, amount: number) {
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

        const orderId = `point_${makeIdUtils.makeId()}`;
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

    async confirmPayment(userId: string, paymentKey: string, orderId: string, amount: number) {
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

        let tossRes: globalThis.Response;
        try {
            tossRes = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ paymentKey, orderId, amount }),
            });
        } catch (error) {
            console.error(error);
            return { success: false, message: '결제 서버 통신에 실패했습니다.' };
        }

        const tossData = await tossRes.json();

        if (!tossRes.ok) {
            await this.pointChargeModel.updateOne(
                { order_id: orderId },
                { $set: { status: 'failed' } },
            );
            return { success: false, message: tossData.message ?? '결제 승인에 실패했습니다.' };
        }

        await this.pointChargeModel.updateOne(
            { order_id: orderId },
            {
                $set: {
                    status: 'paid',
                    payment_key: paymentKey,
                    method: tossData.method ?? '',
                    approved_at: tossData.approvedAt ?? DateUtils.now_date(),
                },
            },
        );

        const user = await this.userModel.findByIdAndUpdate(
            charge.user_id,
            { $inc: { point: amount } },
            { new: true },
        ).select('point');

        await this.xpService.addXp(charge.user_id.toString(), 30);

        return { success: true, message: '충전이 완료되었습니다.', point: user?.point ?? 0 };
    }
}
