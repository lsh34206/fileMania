import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { LevelUtils } from "src/utils/levelUtils";
import { makeIdUtils } from "src/utils/makeId";

@Injectable()
export class xpService {
    constructor(
        @InjectModel('users')
        private readonly userModel: Model<any>,
    ) {}

    async addXp(userId: string, amount: number) {
        try {
            if (!userId || !amount) {
                return;
            }

            const user = await this.userModel.findByIdAndUpdate(
                userId,
                { $inc: { xp: amount } },
                { new: true },
            );
            if (!user) {
                return;
            }

            const previousLevel = user.level ?? 1;
            const { level } = LevelUtils.computeLevel(user.xp ?? 0);
            if (level !== previousLevel) {
                const update: any = { $set: { level } };

                if (level > previousLevel) {
                    update.$push = {
                        massege_list: {
                            id: makeIdUtils.makeId(),
                            message: `레벨업 하셨습니다! 현재 레벨: Lv.${level}`,
                            sender_id: null,
                            sender_name: '시스템',
                            receiver_id: user._id,
                            receiver_name: user.name,
                            createAt: new Date(),
                        },
                    };
                }

                await this.userModel.updateOne({ _id: user._id }, update);
            }
        } catch (error) {
            console.log(error);
        }
    }
}
