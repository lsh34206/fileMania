import { authService } from "../service/auth";
import { socketService } from "../service/socket";
export declare class mainController {
    private readonly authService;
    private readonly socketService;
    constructor(authService: authService, socketService: socketService);
    onlineUsers(): Promise<{
        users: {
            name: any;
            level: any;
        }[];
    }>;
    home(req: any): Promise<{
        name: null;
        role?: undefined;
    } | {
        name: any;
        role: any;
    }>;
    mypage(req: any): Promise<{
        user: any;
    }>;
    updateBio(req: any, bio: string): Promise<{
        success: boolean;
        message: string;
        user?: undefined;
    } | {
        success: boolean;
        user: any;
        message?: undefined;
    }>;
    profile(name: string): Promise<{
        user: any;
    }>;
    logout(req: any, res: any): Promise<void>;
    singup(body: any): Promise<{
        success: boolean;
        message: string;
    }>;
    login(req: any, res: any): Promise<void>;
}
