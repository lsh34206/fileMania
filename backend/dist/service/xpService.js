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
exports.xpService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const levelUtils_1 = require("../utils/levelUtils");
const makeId_1 = require("../utils/makeId");
let xpService = class xpService {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async addXp(userId, amount) {
        try {
            if (!userId || !amount) {
                return;
            }
            const user = await this.userModel.findByIdAndUpdate(userId, { $inc: { xp: amount } }, { new: true });
            if (!user) {
                return;
            }
            const previousLevel = user.level ?? 1;
            const { level } = levelUtils_1.LevelUtils.computeLevel(user.xp ?? 0);
            if (level !== previousLevel) {
                const update = { $set: { level } };
                if (level > previousLevel) {
                    update.$push = {
                        massege_list: {
                            id: makeId_1.makeIdUtils.makeId(),
                            message: `레벨업 하셨습니다! 현재 레벨: Lv.${level}`,
                            sender_id: null,
                            sender_name: '시스템',
                            receiver_id: user._id,
                            receiver_name: user.name,
                            createAt: new Date(),
                        },
                    };
                }
                await this.userModel.updateOne({ _id: user._id }, update);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
};
exports.xpService = xpService;
exports.xpService = xpService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)('users')),
    __metadata("design:paramtypes", [mongoose_1.Model])
], xpService);
//# sourceMappingURL=xpService.js.map