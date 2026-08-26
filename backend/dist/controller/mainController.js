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
exports.mainController = void 0;
const common_1 = require("@nestjs/common");
const auth_1 = require("../service/auth");
const socket_1 = require("../service/socket");
let mainController = class mainController {
    authService;
    socketService;
    constructor(authService, socketService) {
        this.authService = authService;
        this.socketService = socketService;
    }
    async onlineUsers() {
        const users = await this.socketService.getOnlineUsers();
        return { users: users };
    }
    async home(req) {
        console.log(req.cookies.user);
        if (!req.cookies.user) {
            return { name: null };
        }
        const name = await this.authService.login_Load(req.cookies.user);
        const role = await this.authService.role_Load(req.cookies.user);
        console.log('loaded name:', name);
        return { name: name, role: role };
    }
    async mypage(req) {
        if (!req.cookies.user) {
            return { user: null };
        }
        const user = await this.authService.mypage_Load(req.cookies.user);
        return { user: user };
    }
    async updateBio(req, bio) {
        if (!req.cookies.user) {
            return { success: false, message: '로그인이 필요합니다.' };
        }
        const user = await this.authService.updateBio(req.cookies.user, bio ?? '');
        return { success: true, user: user };
    }
    async profile(name) {
        const user = await this.authService.profile_Load(name);
        return { user: user };
    }
    async logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: '로그아웃 실패',
                });
            }
            res.clearCookie('user', { httpOnly: true, path: '/' });
            res.clearCookie('name', { httpOnly: true, path: '/' });
            res.clearCookie('connect.sid', { httpOnly: true, path: '/' });
            return res.json({
                success: true,
                message: '로그아웃 완료',
            });
        });
    }
    async singup(body) {
        const name = body.name;
        const id = body.id;
        const email = body.email;
        const password = body.password;
        const password_check = body.password_check;
        const data = {
            name: name,
            id: id,
            email: email,
            password: password,
            password_check: password_check
        };
        return await this.authService.singup_ok(data);
    }
    async login(req, res) {
        const id = req.body.id;
        const password = req.body.password;
        const pw_Check = await this.authService.pw_Check({ id, password });
        try {
            if (pw_Check.is_password) {
                req.session.user = pw_Check.user;
                console.log(req.session.name);
                res.cookie('user', pw_Check.user, {
                    httpOnly: true,
                    path: "/",
                    sameSite: 'none',
                    secure: true
                });
                res.json(pw_Check.res);
            }
            else {
                res.json(pw_Check.res);
            }
        }
        catch (error) {
            res.json({ success: false, message: "로그인 실패" });
            console.log(error);
        }
    }
};
exports.mainController = mainController;
__decorate([
    (0, common_1.Get)("/online_users"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], mainController.prototype, "onlineUsers", null);
__decorate([
    (0, common_1.Get)("home"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], mainController.prototype, "home", null);
__decorate([
    (0, common_1.Get)("/mypage"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], mainController.prototype, "mypage", null);
__decorate([
    (0, common_1.Post)("/mypage/bio"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)("bio")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], mainController.prototype, "updateBio", null);
__decorate([
    (0, common_1.Get)("/profile/:name"),
    __param(0, (0, common_1.Param)("name")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], mainController.prototype, "profile", null);
__decorate([
    (0, common_1.Get)("/logout"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], mainController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)("/singup_ok"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], mainController.prototype, "singup", null);
__decorate([
    (0, common_1.Post)("/login_ok"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], mainController.prototype, "login", null);
exports.mainController = mainController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [auth_1.authService,
        socket_1.socketService])
], mainController);
//# sourceMappingURL=mainController.js.map