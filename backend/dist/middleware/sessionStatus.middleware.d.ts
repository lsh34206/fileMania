import { NestMiddleware } from "@nestjs/common";
import { Model } from "mongoose";
import { Request, Response, NextFunction } from "express";
export declare class SessionStatusMiddleware implements NestMiddleware {
    private readonly userModel;
    constructor(userModel: Model<any>);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
    private forceLogout;
}
