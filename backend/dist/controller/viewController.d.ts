import { listViewService } from "../service/listView";
import { authService } from "../service/auth";
import { ViewService } from "../service/view";
export declare class viewController {
    private readonly listViewService;
    private readonly authService;
    private readonly viewService;
    constructor(listViewService: listViewService, authService: authService, viewService: ViewService);
    login_auth(userid: string): Promise<any>;
    gym_view(req: any, type: string, keyword: string): Promise<{
        files: any[] | never[] | undefined;
        id: never[] | import("mongoose").Types.ObjectId[] | undefined;
    }>;
    free_view(req: any, type: string, keyword: string): Promise<{
        files: any[] | never[] | undefined;
        id: never[] | import("mongoose").Types.ObjectId[] | undefined;
        writer_is_me: never[] | boolean[] | undefined;
    }>;
    paid_view(req: any, type: string, keyword: string): Promise<{
        files: any[] | undefined;
        id: any[] | undefined;
        writer_is_me: boolean[] | undefined;
    }>;
    view_file(req: any, download_type: string, type: string, id: string): Promise<{
        file: any;
        name: any;
        writer_is_me: boolean | undefined;
        id: string | undefined;
        user_id: string | undefined;
        chatList: any[] | undefined;
        bidsList: any[] | undefined;
        gym: any;
        purchased?: undefined;
    } | {
        file: any;
        name: any;
        writer_is_me: boolean | undefined;
        id: string | undefined;
        purchased: boolean | undefined;
        user_id?: undefined;
        chatList?: undefined;
        bidsList?: undefined;
        gym?: undefined;
    }>;
    community_featured(): Promise<{
        post: any;
        kind: string | null;
    }>;
    commuity_list_view(type: string, req: any, keyword: string, sort: string): Promise<{
        name: any;
        posts: any[] | undefined;
        message?: undefined;
    } | {
        message: any;
        name?: undefined;
        posts?: undefined;
    }>;
    commuity_post_load(type: string, id: string, req: any, res: any): Promise<{
        name: any;
        post: any;
        myId: any;
        writer_is_me: boolean | undefined;
        is_admin: boolean | undefined;
        message?: undefined;
    } | {
        message: any;
        name?: undefined;
        post?: undefined;
        myId?: undefined;
        writer_is_me?: undefined;
        is_admin?: undefined;
    }>;
}
