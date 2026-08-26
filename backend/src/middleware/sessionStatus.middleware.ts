import { Injectable, NestMiddleware } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class SessionStatusMiddleware implements NestMiddleware {
    constructor(
        @InjectModel('users')
        private readonly userModel: Model<any>,
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const userId = (req as any).cookies?.user;

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return next();
        }

        try {
            const user = await this.userModel.findById(userId).select('status suspended_until');

            if (!user) {
                this.forceLogout(req, res);
                return next();
            }

            if (user.status === 'banned') {
                this.forceLogout(req, res);
                return next();
            }

            if (user.status === 'suspended') {
                if (user.suspended_until && new Date(user.suspended_until) > new Date()) {
                    this.forceLogout(req, res);
                    return next();
                }
                await this.userModel.updateOne(
                    { _id: user._id },
                    { $set: { status: 'active', suspended_until: null, suspend_reason: '' } },
                );
            }
        } catch (error) {
            console.log(error);
        }

        return next();
    }

    private forceLogout(req: Request, res: Response) {
        res.clearCookie('user', { httpOnly: true, path: '/' });
        if ((req as any).cookies) {
            (req as any).cookies.user = undefined;
        }
    }
}
