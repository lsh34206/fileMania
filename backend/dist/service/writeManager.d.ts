import { Model } from "mongoose";
import { xpService } from "./xpService";
export declare class writeManagerService {
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
    private readonly community;
    private modelMap;
    constructor(xpService: xpService, userModel: Model<any>, imageModel: Model<any>, audioModel: Model<any>, videoModel: Model<any>, appModel: Model<any>, documentModel: Model<any>, gymsModel: Model<any>, gymResultsModel: Model<any>, gymBidsModel: Model<any>, gymChatsModel: Model<any>, community: Model<any>);
    community_write_ok(writer_id: string, type: string, data: string): Promise<{
        success: boolean;
        message: any;
    }>;
    community_edit_ok(writer_id: string, postId: string, type: string, data: string): Promise<{
        success: boolean;
        message: string;
        category: any;
    } | {
        success: boolean;
        message: any;
        category?: undefined;
    }>;
    file_edit_ok(user_id: string, type: string, id: string, data: any): Promise<{
        success: boolean;
        message: any;
    }>;
    writer_delete(download_type: string, type: string, id: string, user_id: string): Promise<{
        success: boolean;
        message: any;
    }>;
}
