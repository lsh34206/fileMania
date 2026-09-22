import { Model } from "mongoose";
import { socketService } from "./socket";
import { logService } from "./logService";
export declare class adminService {
    private readonly socketService;
    private readonly logService;
    private readonly userModel;
    constructor(socketService: socketService, logService: logService, userModel: Model<any>);
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
    listLogs(adminId: string, type?: string, keyword?: string): Promise<{
        success: boolean;
        message: string;
        logs?: undefined;
    } | {
        success: boolean;
        logs: any[];
        message?: undefined;
    }>;
}
