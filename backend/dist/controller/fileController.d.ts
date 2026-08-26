import { UploadService } from "../service/fileUpload";
export declare class fileController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    upload(type: string, file: Express.Multer.File, rawData: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
