import { Model } from "mongoose";
export declare class chatService {
    private readonly userModel;
    private readonly gymsModel;
    private readonly gymChatsModel;
    private readonly chatroomsModel;
    private readonly messagesModel;
    constructor(userModel: Model<any>, gymsModel: Model<any>, gymChatsModel: Model<any>, chatroomsModel: Model<any>, messagesModel: Model<any>);
    main_load(userId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            name: any;
            userId: any;
            chatList: any[];
        };
    } | {
        success: boolean;
        message: string;
        data?: undefined;
    }>;
}
