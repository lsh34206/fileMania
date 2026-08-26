import type { Response } from 'express';
import { downloadService } from "../service/download";
export declare class mediaController {
    private readonly downloadService;
    constructor(downloadService: downloadService);
    serve(req: any, type: string, id: string, res: Response): Promise<void | Response<any, Record<string, any>>>;
    preview(type: string, id: string, res: Response): Promise<Response<any, Record<string, any>>>;
}
