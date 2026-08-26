import { adminService } from "../service/adminService";
export declare class adminController {
    private readonly adminService;
    constructor(adminService: adminService);
    listUsers(req: any): Promise<{
        success: boolean;
        message: string;
        users?: undefined;
    } | {
        success: boolean;
        users: any[];
        message?: undefined;
    }>;
    ban(req: any, id: string, reason: string): Promise<{
        success: boolean;
        message: string;
    }>;
    suspend(req: any, id: string, days: number, reason: string): Promise<{
        success: boolean;
        message: string;
    }>;
    restore(req: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
