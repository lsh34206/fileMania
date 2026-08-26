import { Model } from "mongoose";
export declare class downloadService {
    private readonly userModel;
    private readonly imageModel;
    private readonly audioModel;
    private readonly videoModel;
    private readonly appModel;
    private readonly documentModel;
    private readonly purchaseModel;
    private modelMap;
    constructor(userModel: Model<any>, imageModel: Model<any>, audioModel: Model<any>, videoModel: Model<any>, appModel: Model<any>, documentModel: Model<any>, purchaseModel: Model<any>);
    private checkAccess;
    serve_file(type: string, id: string, userId?: string): Promise<{
        success: boolean;
        message: string;
        status?: undefined;
        path?: undefined;
    } | {
        success: boolean;
        message: string;
        status: number;
        path?: undefined;
    } | {
        success: boolean;
        path: string;
        message?: undefined;
        status?: undefined;
    }>;
    private extractVideoFrame;
    serve_preview(type: string, id: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        buffer?: undefined;
    } | {
        success: boolean;
        message: string;
        status?: undefined;
        buffer?: undefined;
    } | {
        success: boolean;
        buffer: Buffer<ArrayBuffer>;
        message?: undefined;
        status?: undefined;
    }>;
    download_file(type: string, id: string, userId?: string): Promise<{
        success: boolean;
        message: string;
        status?: undefined;
        path?: undefined;
        name?: undefined;
    } | {
        success: boolean;
        message: string;
        status: number;
        path?: undefined;
        name?: undefined;
    } | {
        success: boolean;
        message: string;
        path: string;
        name: string;
        status?: undefined;
    }>;
}
