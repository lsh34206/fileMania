import { Model } from "mongoose";
export declare class xpService {
    private readonly userModel;
    constructor(userModel: Model<any>);
    addXp(userId: string, amount: number): Promise<void>;
}
