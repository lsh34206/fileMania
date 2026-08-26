import { Model } from "mongoose";
export declare class messageService {
    private readonly userModel;
    private readonly gymsModel;
    private readonly gymChatsModel;
    constructor(userModel: Model<any>, gymsModel: Model<any>, gymChatsModel: Model<any>);
    message_main(userId: string): Promise<{
        name: any;
        mailList: any[];
        chatRooms: any[];
        tradeRooms: any[];
    } | null>;
    deleteMail(userId: string, mailId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
