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
exports.viewController = void 0;
const common_1 = require("@nestjs/common");
const listView_1 = require("../service/listView");
const auth_1 = require("../service/auth");
const view_1 = require("../service/view");
let viewController = class viewController {
    listViewService;
    authService;
    viewService;
    constructor(listViewService, authService, viewService) {
        this.listViewService = listViewService;
        this.authService = authService;
        this.viewService = viewService;
    }
    async login_auth(userid) {
        const name = await this.authService.login_Load(userid);
        if (name != null) {
            return name;
        }
        else {
            return '로그인 해주세요.';
        }
    }
    async gym_view(req, type, keyword) {
        const name = await this.login_auth(req.cookies.user);
        const files = await this.listViewService.gym_view(type, name, keyword);
        return { files: files.files, id: files.id };
    }
    async free_view(req, type, keyword) {
        const name = await this.login_auth(req.cookies.user);
        const files = await this.listViewService.free_view(type, name, keyword);
        return { files: files.files, id: files.id, writer_is_me: files.writer_is_me };
    }
    async paid_view(req, type, keyword) {
        const name = await this.login_auth(req.cookies.user);
        const files = await this.listViewService.paid_view(type, name, keyword);
        return { files: files.files, id: files.id, writer_is_me: files.writer_is_me };
    }
    async view_file(req, download_type, type, id) {
        if (download_type === "gym") {
            const ret = await this.viewService.gym_view(download_type, type, id, req.cookies.user);
            return { file: ret.file, name: ret.name, writer_is_me: ret.writer_is_me, id: ret.id, user_id: ret.user_id,
                chatList: ret.chatList,
                bidsList: ret.bidsList,
                gym: ret.gym
            };
        }
        else {
            const ret = await this.viewService.view_file(download_type, type, id, req.cookies.user);
            return { file: ret.file, name: ret.name, writer_is_me: ret.writer_is_me, id: ret.id, purchased: ret.purchased };
        }
    }
    async community_featured() {
        const ret = await this.listViewService.featured_post();
        return { post: ret.post, kind: ret.kind };
    }
    async commuity_list_view(type, req, keyword, sort) {
        try {
            const name = await this.login_auth(req.cookies.user);
            const ret = await this.listViewService.community_list_view(type, name, keyword, sort);
            return { name: name, posts: ret.list };
        }
        catch (error) {
            return { message: error };
        }
    }
    async commuity_post_load(type, id, req, res) {
        try {
            const viewer = req.cookies.user;
            console.log(viewer);
            const name = await this.login_auth(viewer);
            console.log(name);
            const cookieKey = `viewed_${viewer}`;
            const alreadyViewed = req.cookies[cookieKey];
            if (!alreadyViewed) {
                res.cookie(cookieKey, 'true', {
                    maxAge: 12 * 60 * 60 * 1000,
                    httpOnly: true,
                });
                const ret = await this.viewService.community_post_count_view(type, id, name, viewer);
                return { name: name, post: ret.post, myId: viewer, writer_is_me: ret.writer_is_me, is_admin: ret.is_admin };
            }
            const ret = await this.viewService.community_post_view(type, id, name, viewer);
            return { name: name, post: ret.post, myId: viewer, writer_is_me: ret.writer_is_me, is_admin: ret.is_admin };
        }
        catch (error) {
            return { message: error };
        }
    }
};
exports.viewController = viewController;
__decorate([
    (0, common_1.Post)("/download/gym/:type"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("type")),
    __param(2, (0, common_1.Body)("keyword")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], viewController.prototype, "gym_view", null);
__decorate([
    (0, common_1.Post)("/download/free/:type"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("type")),
    __param(2, (0, common_1.Body)("keyword")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], viewController.prototype, "free_view", null);
__decorate([
    (0, common_1.Post)("/download/paid/:type"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("type")),
    __param(2, (0, common_1.Body)("keyword")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], viewController.prototype, "paid_view", null);
__decorate([
    (0, common_1.Get)("/download/:download_type/:type/:id"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("download_type")),
    __param(2, (0, common_1.Param)("type")),
    __param(3, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], viewController.prototype, "view_file", null);
__decorate([
    (0, common_1.Get)("/community_featured"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], viewController.prototype, "community_featured", null);
__decorate([
    (0, common_1.Post)("/community/:type"),
    __param(0, (0, common_1.Param)("type")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)("keyword")),
    __param(3, (0, common_1.Body)("sort")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String]),
    __metadata("design:returntype", Promise)
], viewController.prototype, "commuity_list_view", null);
__decorate([
    (0, common_1.Get)("/community/:type/:id"),
    __param(0, (0, common_1.Param)("type")),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], viewController.prototype, "commuity_post_load", null);
exports.viewController = viewController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [listView_1.listViewService,
        auth_1.authService,
        view_1.ViewService])
], viewController);
//# sourceMappingURL=viewController.js.map