import { Model } from "mongoose";
type singup_data_type = {
    name: string;
    id: string;
    email: string;
    password: string;
    password_check: string;
};
type login_data_type = {
    id: string;
    password: string;
};
export declare class authService {
    private readonly userModel;
    constructor(userModel: Model<any>);
    login_Load(userid: string): Promise<any>;
    role_Load(userid: string): Promise<any>;
    mypage_Load(userid: string): Promise<any>;
    updateBio(userid: string, bio: string): Promise<any>;
    profile_Load(name: string): Promise<any>;
    singup_ok(data: singup_data_type): Promise<{
        success: boolean;
        message: string;
    }>;
    pw_Check(data: login_data_type): Promise<{
        is_password: boolean;
        res: {
            success: boolean;
            message: string;
        };
        user?: undefined;
    } | {
        is_password: any;
        user: any;
        res: {
            success: boolean;
            message: string;
        };
    }>;
}
export {};
