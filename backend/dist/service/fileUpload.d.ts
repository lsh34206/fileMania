import { Model } from "mongoose";
import { xpService } from "./xpService";
export declare class UploadService {
    private readonly xpService;
    private readonly userModel;
    private readonly imageModel;
    private readonly audioModel;
    private readonly videoModel;
    private readonly appModel;
    private readonly documentModel;
    private readonly gymsModel;
    private readonly gymResultsModel;
    private readonly gymBidsModel;
    private readonly gymChatsModel;
    private modelMap;
    constructor(xpService: xpService, userModel: Model<any>, imageModel: Model<any>, audioModel: Model<any>, videoModel: Model<any>, appModel: Model<any>, documentModel: Model<any>, gymsModel: Model<any>, gymResultsModel: Model<any>, gymBidsModel: Model<any>, gymChatsModel: Model<any>);
    uploadFile({ file, data, userId, type, }: {
        file: Express.Multer.File;
        data: any;
        userId: string;
        type: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
