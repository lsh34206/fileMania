import type { Response } from 'express';
import { authService } from "../service/auth";
import { downloadService } from "../service/download";
export declare class downloadController {
    private readonly authService;
    private readonly downloadService;
    constructor(authService: authService, downloadService: downloadService);
    download(req: any, type: string, id: string, res: Response): Promise<void | Response<any, Record<string, any>>>;
}
