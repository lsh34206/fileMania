import { Model } from "mongoose";
import { socketService } from "./socket";
export declare class adminService {
    private readonly socketService;
    private readonly userModel;
    constructor(socketService: socketService, userModel: Model<any>);
    private requireAdmin;
    listUsers(adminId: string): Promise<{
        success: boolean;
        message: string;
        users?: undefined;
    } | {
        success: boolean;
        users: any[];
        message?: undefined;
    }>;
    banUser(adminId: string, targetId: string, reason: string): Promise<{
        success: boolean;
        message: string;
    }>;
    suspendUser(adminId: string, targetId: string, days: number, reason: string): Promise<{
        success: boolean;
        message: string;
    }>;
    restoreUser(adminId: string, targetId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
