import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class chatService{
    constructor(
        @InjectModel('users')
        private readonly userModel: Model<any>,

        @InjectModel('gyms')
        private readonly gymsModel: Model<any>,

        @InjectModel('gymChats')
        private readonly gymChatsModel: Model<any>,

        @InjectModel('chatrooms')
        private readonly chatroomsModel: Model<any>,

        @InjectModel('messages')
        private readonly messagesModel: Model<any>,
    ){}


    async main_load(userId: string){
        try{
        const user = await this.userModel.findById(userId);
        const user_id = user._id.toString();

            const chatList = await this.chatroomsModel.find({participants: user_id}).sort({last_message_time: -1});
            return { success: true, message: '채팅 목록 로드 성공',data: {
                name: user.name,userId: user_id,chatList: chatList
            }};
        
        }catch(error){
            console.error(error);
            return { success: false, message: '채팅 목록 로드 실패' };
        }
    }
}
