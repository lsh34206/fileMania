"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionStatusMiddleware = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
let SessionStatusMiddleware = class SessionStatusMiddleware {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async use(req, res, next) {
        const userId = req.cookies?.user;
        if (!userId || !mongoose_1.Types.ObjectId.isValid(userId)) {
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
                await this.userModel.updateOne({ _id: user._id }, { $set: { status: 'active', suspended_until: null, suspend_reason: '' } });
            }
        }
        catch (error) {
            console.log(error);
        }
        return next();
    }
    forceLogout(req, res) {
        res.clearCookie('user', { httpOnly: true, path: '/' });
        if (req.cookies) {
            req.cookies.user = undefined;
        }
    }
};
exports.SessionStatusMiddleware = SessionStatusMiddleware;
exports.SessionStatusMiddleware = SessionStatusMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)('users')),
    __metadata("design:paramtypes", [mongoose_1.Model])
], SessionStatusMiddleware);
//# sourceMappingURL=sessionStatus.middleware.js.map