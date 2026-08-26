import { authService } from "../service/auth";
import { writeManagerService } from "../service/writeManager";
export declare class writeManagerController {
    private readonly authService;
    private readonly writeManagerService;
    constructor(authService: authService, writeManagerService: writeManagerService);
    login_auth(userid: string): Promise<any>;
    writer_delete(req: any, download_type: string, type: string, id: string): Promise<{
        success: boolean;
        message: any;
    }>;
    community_write(type: string, req: any, data: string): Promise<{
        success: boolean;
        message: any;
    }>;
    community_edit(type: string, id: string, req: any, data: string): Promise<{
        success: boolean;
        message: string;
        category?: undefined;
    } | {
        success: boolean;
        message: any;
        category: any;
    }>;
    file_edit(type: string, id: string, req: any, data: string): Promise<{
        success: boolean;
        message: any;
    }>;
}
