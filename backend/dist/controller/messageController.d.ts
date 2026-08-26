import { messageService } from "../service/messageService";
export declare class messageController {
    private readonly messageService;
    constructor(messageService: messageService);
    message_main(req: any): Promise<{
        name: any;
        mailList: any[];
        chatRooms: any[];
        tradeRooms: any[];
    } | {
        name: null;
    }>;
    delete_mail(req: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
