import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class messageService{
    constructor(
        @InjectModel('users')
        private readonly userModel: Model<any>,

        @InjectModel('gyms')
        private readonly gymsModel: Model<any>,

        @InjectModel('gymChats')
        private readonly gymChatsModel: Model<any>,
    ){}

    async message_main(userId: string){
        const user = await this.userModel.findById(userId).select("name massege_list");
        if(!user){
            return null;
        }

        const mailList = [...(user.massege_list ?? [])].reverse();

        const roomIds = await this.gymChatsModel.distinct("room_id", {sender_id: user._id});

        const chatRooms = await this.gymsModel.find({
            status: "active",
            $or: [
                {file_id: {$in: roomIds}},
                {seller_id: user._id},
                {highest_bidder_id: user._id},
            ],
        }).sort({createdAt: -1});

        const tradeRooms = await this.gymsModel.find({
            status: {$in: ["ended", "paid"]},
            $or: [
                {seller_id: user._id},
                {highest_bidder_id: user._id},
            ],
        }).sort({end_time: -1});

        return {name: user.name, mailList: mailList, chatRooms: chatRooms, tradeRooms: tradeRooms};
    }

    async deleteMail(userId: string, mailId: string){
        const result = await this.userModel.updateOne(
            {_id: userId},
            {$pull: {massege_list: {id: mailId}}},
        );

        if(result.modifiedCount === 0){
            return {success: false, message: '삭제할 우편을 찾을 수 없습니다.'};
        }

        return {success: true, message: '우편이 삭제되었습니다.'};
    }
}
