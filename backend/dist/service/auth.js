"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const bcrypt = __importStar(require("bcrypt"));
let authService = class authService {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async login_Load(userid) {
        const name = await this.userModel.findById(userid).select("name");
        return name?.name ?? null;
    }
    async role_Load(userid) {
        const user = await this.userModel.findById(userid).select("role");
        return user?.role ?? null;
    }
    async mypage_Load(userid) {
        const user = await this.userModel.findById(userid);
        return user ?? null;
    }
    async updateBio(userid, bio) {
        const user = await this.userModel.findByIdAndUpdate(userid, { bio: bio }, { new: true });
        return user ?? null;
    }
    async profile_Load(name) {
        const user = await this.userModel
            .findOne({ name })
            .select("name bio level xp createdAt writer_count");
        return user ?? null;
    }
    async singup_ok(data) {
        try {
            const collection = this.userModel;
            const search_id = await collection?.findOne({ id: data.id });
            console.log(search_id);
            if (search_id) {
                return { success: false, message: '이미 존재하는 아이디입니다.' };
            }
            const search_name = await collection?.findOne({ name: data.name });
            if (search_name) {
                return { success: false, message: '이미 존재하는 이름입니다.' };
            }
            if (!search_id && !search_name) {
                const hashed_password = bcrypt.hashSync(data.password, 10);
                const result = await collection?.insertOne({ name: data.name, id: data.id, email: data.email, password: hashed_password });
                return { success: true, message: '회원가입 완료' };
            }
            else {
                return { success: true, message: '회원가입 완료' };
            }
        }
        catch (error) {
            console.log(error);
            return { success: false, message: "회원가입 실패" };
        }
    }
    async pw_Check(data) {
        const send_json = { suc: { success: true, message: '로그인 완료' }, failed: { success: false, message: '비밀번호가 일치하지 않습니다.' } };
        try {
            const collection = this.userModel;
            const search_user = await collection?.findOne({ id: data.id });
            if (!search_user) {
                return { is_password: false, res: send_json.failed };
            }
            const is_password = bcrypt.compareSync(data.password, search_user.password);
            if (!is_password) {
                return { is_password: false, res: send_json.failed };
            }
            if (search_user.status === 'banned') {
                return { is_password: false, res: { success: false, message: `차단된 계정입니다.${search_user.ban_reason ? ` (사유: ${search_user.ban_reason})` : ''}` } };
            }
            if (search_user.status === 'suspended') {
                if (search_user.suspended_until && new Date(search_user.suspended_until) > new Date()) {
                    const until = new Date(search_user.suspended_until).toLocaleString('ko-KR');
                    return { is_password: false, res: { success: false, message: `정지된 계정입니다. (${until}까지)${search_user.suspend_reason ? ` 사유: ${search_user.suspend_reason}` : ''}` } };
                }
                await collection.updateOne({ _id: search_user._id }, { $set: { status: 'active', suspended_until: null, suspend_reason: '' } });
            }
            const user = search_user._id.toString();
            return { is_password: is_password, user: user, res: send_json.suc };
        }
        catch (err) {
            return { is_password: false, res: send_json.failed };
        }
    }
};
exports.authService = authService;
exports.authService = authService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)("users")),
    __metadata("design:paramtypes", [mongoose_1.Model])
], authService);
//# sourceMappingURL=auth.js.map