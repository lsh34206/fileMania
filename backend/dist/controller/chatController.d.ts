import { chatService } from "../service/chatService";
import { authService } from "../service/auth";
export declare class chatController {
    private readonly chatService;
    private readonly authService;
    constructor(chatService: chatService, authService: authService);
    login_auth(userid: string): Promise<any>;
    chat_main(req: any): Promise<{
        name: null;
        data?: undefined;
    } | {
        data: {
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
        };
        name: any;
    }>;
    chat_room(req: any, room_id: string): Promise<{
        name: null;
    } | undefined>;
}
