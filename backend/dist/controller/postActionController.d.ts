import { listViewService } from "../service/listView";
import { authService } from "../service/auth";
import { ViewService } from "../service/view";
import { postActionService } from "../service/postActionService";
export declare class postActionController {
    private readonly listViewService;
    private readonly authService;
    private readonly viewService;
    private readonly postActionService;
    constructor(listViewService: listViewService, authService: authService, viewService: ViewService, postActionService: postActionService);
    login_auth(userid: string): Promise<any>;
    community_post_like(postId: string, req: any): Promise<{
        like_count: any;
        myId: any;
        message: any;
        name: any;
    }>;
    community_comment_write(postId: string, req: any, content: string, parent_id: string): Promise<{
        success: boolean;
        message: string;
        name?: undefined;
        myId?: undefined;
    } | {
        success: boolean | undefined;
        message: any;
        name: any;
        myId: any;
    }>;
    community_comment_like(postId: string, comment_id: string, req: any): Promise<{
        success: boolean | undefined;
        message: any;
        name: any;
        myId: any;
    }>;
    community_comment_delete(postId: string, comment_id: string, type: string, req: any): Promise<{
        success: boolean;
        message: string;
        name?: undefined;
        myId?: undefined;
    } | {
        success: boolean;
        message: any;
        name: any;
        myId: any;
    }>;
    community_post_delete(postId: string, type: string, req: any): Promise<{
        success: boolean;
        message: string;
        name?: undefined;
        myId?: undefined;
    } | {
        success: boolean;
        message: any;
        name: any;
        myId: any;
    }>;
}
