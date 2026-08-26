import { Model } from "mongoose";
export declare class ViewService {
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
    private readonly purchaseModel;
    private modelMap;
    constructor(userModel: Model<any>, imageModel: Model<any>, audioModel: Model<any>, videoModel: Model<any>, appModel: Model<any>, documentModel: Model<any>, gymsModel: Model<any>, gymResultsModel: Model<any>, gymBidsModel: Model<any>, gymChatsModel: Model<any>, community: Model<any>, purchaseModel: Model<any>);
    view_file(download_type: string, type: string, id: string, user_id: string): Promise<{
        file: any;
        name: any;
        writer_is_me: boolean;
        id: string;
        purchased: boolean;
        success?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        file?: undefined;
        name?: undefined;
        writer_is_me?: undefined;
        id?: undefined;
        purchased?: undefined;
    }>;
    gym_view(download_type: string, type: string, id: string, user_id: string): Promise<{
        file: any;
        name: any;
        writer_is_me: boolean;
        id: string;
        user_id: string;
        chatList: any[];
        bidsList: any[];
        gym: any;
        success?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        file?: undefined;
        name?: undefined;
        writer_is_me?: undefined;
        id?: undefined;
        user_id?: undefined;
        chatList?: undefined;
        bidsList?: undefined;
        gym?: undefined;
    }>;
    community_post_writer_is_me(viewer: string, postId: string, type: string): Promise<boolean | undefined>;
    is_admin(viewer: string): Promise<boolean>;
    community_post_count_view(type: string, id: string, name: string, viewer: string): Promise<{
        post: any;
        name: string;
        writer_is_me: boolean | undefined;
        is_admin: boolean;
        message: string;
    } | {
        message: any;
        name: string;
        post?: undefined;
        writer_is_me?: undefined;
        is_admin?: undefined;
    }>;
    community_post_view(type: string, id: string, name: string, viewer: string): Promise<{
        post: any;
        name: string;
        writer_is_me: boolean | undefined;
        is_admin: boolean;
        message: string;
    } | {
        message: any;
        name: string;
        post?: undefined;
        writer_is_me?: undefined;
        is_admin?: undefined;
    }>;
}
