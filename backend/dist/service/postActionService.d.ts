import { Model } from "mongoose";
import { xpService } from "./xpService";
export declare class postActionService {
    private readonly xpService;
    private readonly userModel;
    private readonly community;
    private modelMap;
    constructor(xpService: xpService, userModel: Model<any>, community: Model<any>);
    community_post_like(postId: string, userId: string): Promise<{
        like_count: any;
        message: string;
    } | {
        message: any;
        like_count?: undefined;
    }>;
    new_id(): string;
    community_post_delete(postId: string, type: string, userId: string): Promise<{
        post: import("mongodb").DeleteResult;
        success: boolean;
        message: string;
    } | {
        success: boolean;
        message: any;
        post?: undefined;
    }>;
    community_comment_delete(postId: string, type: string, commentId: string, userId: string): Promise<{
        post: import("mongoose").UpdateWriteOpResult;
        success: boolean;
        message: string;
    } | {
        success: boolean;
        message: any;
        post?: undefined;
    }>;
    community_comment_write(postId: string, parent_id: string | null, name: string, writer: string, content: string): Promise<{
        success: boolean;
        message: string;
        ret: import("mongoose").UpdateWriteOpResult;
    } | {
        message: any;
        success?: undefined;
        ret?: undefined;
    }>;
    community_comment_like(postId: string, commentId: string, userId: string): Promise<{
        success: boolean;
        message: string;
        ret: import("mongoose").UpdateWriteOpResult;
    } | {
        message: any;
        success?: undefined;
        ret?: undefined;
    }>;
}
