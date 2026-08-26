import { Model } from "mongoose";
import { xpService } from "./xpService";
export declare class purchaseService {
    private readonly xpService;
    private readonly userModel;
    private readonly imageModel;
    private readonly audioModel;
    private readonly videoModel;
    private readonly appModel;
    private readonly documentModel;
    private readonly purchaseModel;
    private modelMap;
    constructor(xpService: xpService, userModel: Model<any>, imageModel: Model<any>, audioModel: Model<any>, videoModel: Model<any>, appModel: Model<any>, documentModel: Model<any>, purchaseModel: Model<any>);
    purchase(userId: string, type: string, id: string): Promise<{
        success: boolean;
        message: string;
        point?: undefined;
    } | {
        success: boolean;
        message: string;
        point: any;
    }>;
}
