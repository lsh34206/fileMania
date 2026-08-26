import { Model, Types } from "mongoose";
export declare class listViewService {
    private readonly userModel;
    private readonly imageModel;
    private readonly audioModel;
    private readonly videoModel;
    private readonly appModel;
    private readonly documentModel;
    private readonly community;
    private modelMap;
    constructor(userModel: Model<any>, imageModel: Model<any>, audioModel: Model<any>, videoModel: Model<any>, appModel: Model<any>, documentModel: Model<any>, community: Model<any>);
    private attachUploaderLevel;
    gym_view(type: string, name: string, keyword?: string): Promise<{
        files: never[];
        id: never[];
        name?: undefined;
        end_time?: undefined;
        start_price?: undefined;
        success?: undefined;
        message?: undefined;
    } | {
        files: any[];
        id: Types.ObjectId[];
        name: string;
        end_time: string;
        start_price: any[];
        success?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        files?: undefined;
        id?: undefined;
        name?: undefined;
        end_time?: undefined;
        start_price?: undefined;
    }>;
    free_view(type: string, name: string, keyword?: string): Promise<{
        files: never[];
        id: never[];
        writer_is_me: never[];
        name?: undefined;
        success?: undefined;
        message?: undefined;
    } | {
        files: any[];
        id: Types.ObjectId[];
        name: string;
        writer_is_me: boolean[];
        success?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        files?: undefined;
        id?: undefined;
        writer_is_me?: undefined;
        name?: undefined;
    }>;
    paid_view(type: string, name: string, keyword?: string): Promise<{
        files: any[];
        id: any[];
        name: string;
        writer_is_me: boolean[];
        success?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        files?: undefined;
        id?: undefined;
        name?: undefined;
        writer_is_me?: undefined;
    }>;
    community_list_view(type: string, name: string, keyword?: string, sort?: string): Promise<{
        list: any[];
        name: string;
        message: string;
    } | {
        message: any;
        name: string;
        list?: undefined;
    }>;
    featured_post(): Promise<{
        post: any;
        kind: string | null;
    }>;
}
