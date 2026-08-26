import { Injectable } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { xpService } from "src/service/xpService";

@Injectable()
export class purchaseService {
    private modelMap: Record<string, Model<any>>;

    constructor(
        private readonly xpService: xpService,

        @InjectModel('users')
        private readonly userModel: Model<any>,

        @InjectModel('image')
        private readonly imageModel: Model<any>,

        @InjectModel('audio')
        private readonly audioModel: Model<any>,

        @InjectModel('video')
        private readonly videoModel: Model<any>,

        @InjectModel('app')
        private readonly appModel: Model<any>,

        @InjectModel('document')
        private readonly documentModel: Model<any>,

        @InjectModel('purchases')
        private readonly purchaseModel: Model<any>,
    ) {
        this.modelMap = {
            image: this.imageModel,
            audio: this.audioModel,
            video: this.videoModel,
            document: this.documentModel,
            app: this.appModel,
        };
    }

    async purchase(userId: string, type: string, id: string) {
        if (!this.modelMap[type]) {
            return { success: false, message: '잘못된 파일 종류입니다.' };
        }
        if (!Types.ObjectId.isValid(id)) {
            return { success: false, message: '잘못된 요청입니다.' };
        }

        const user = await this.userModel.findById(userId);
        if (!user) {
            return { success: false, message: '로그인 해주세요.' };
        }

        const collection = this.modelMap[type];
        const file = await collection.findOne({ _id: new Types.ObjectId(id), download_type: 'paid' });
        if (!file) {
            return { success: false, message: '존재하지 않는 파일입니다.' };
        }

        if (file.uploader === user.name) {
            return { success: false, message: '본인이 업로드한 파일입니다.' };
        }

        const already = await this.purchaseModel.findOne({ user_id: user._id, file_id: file._id });
        if (already) {
            return { success: true, message: '이미 구매한 파일입니다.' };
        }

        if ((user.point ?? 0) < file.price) {
            return { success: false, message: '포인트가 부족합니다.' };
        }

        await this.userModel.updateOne({ _id: user._id }, { $inc: { point: -file.price } });

        try {
            await this.purchaseModel.insertOne({
                user_id: user._id,
                file_id: file._id,
                file_type: type,
                price: file.price,
            });
        } catch (error) {
            // 동시 요청 등으로 이미 구매 레코드가 존재하면 방금 차감한 포인트를 되돌린다.
            await this.userModel.updateOne({ _id: user._id }, { $inc: { point: file.price } });
            return { success: true, message: '이미 구매한 파일입니다.' };
        }

        const seller = await this.userModel.findOne({ name: file.uploader });
        if (seller) {
            await this.userModel.updateOne({ _id: seller._id }, { $inc: { point: file.price } });
        }

        await this.xpService.addXp(user._id.toString(), 5);

        const updatedUser = await this.userModel.findById(user._id).select('point');

        return { success: true, message: '구매가 완료되었습니다.', point: updatedUser?.point ?? 0 };
    }
}
