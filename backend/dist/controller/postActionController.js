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
exports.postActionController = void 0;
const common_1 = require("@nestjs/common");
const listView_1 = require("../service/listView");
const auth_1 = require("../service/auth");
const view_1 = require("../service/view");
const postActionService_1 = require("../service/postActionService");
let postActionController = class postActionController {
    listViewService;
    authService;
    viewService;
    postActionService;
    constructor(listViewService, authService, viewService, postActionService) {
        this.listViewService = listViewService;
        this.authService = authService;
        this.viewService = viewService;
        this.postActionService = postActionService;
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
    async community_post_like(postId, req) {
        const userId = req.cookies.user;
        const name = await this.login_auth(userId);
        const ret = await this.postActionService.community_post_like(postId, userId);
        console.log(ret);
        return { like_count: ret.like_count, myId: userId, message: ret.message, name: name };
    }
    async community_comment_write(postId, req, content, parent_id) {
        const userId = req.cookies.user;
        if (!userId) {
            return { success: false, message: '로그인 해주세요.' };
        }
        const name = await this.login_auth(userId);
        const ret = await this.postActionService.community_comment_write(postId, parent_id, name, userId, content);
        console.log(ret);
        return { success: ret.success, message: ret.message, name: name, myId: userId };
    }
    async community_comment_like(postId, comment_id, req) {
        const userId = req.cookies.user;
        const name = await this.login_auth(userId);
        const ret = await this.postActionService.community_comment_like(postId, comment_id, userId);
        console.log(ret);
        return { success: ret.success, message: ret.message, name: name, myId: userId };
    }
    async community_comment_delete(postId, comment_id, type, req) {
        const userId = req.cookies.user;
        if (!userId) {
            return { success: false, message: '로그인 해주세요.' };
        }
        const name = await this.login_auth(userId);
        const ret = await this.postActionService.community_comment_delete(postId, type, comment_id, userId);
        console.log(ret);
        return { success: ret.success, message: ret.message, name: name, myId: userId };
    }
    async community_post_delete(postId, type, req) {
        const userId = req.cookies.user;
        if (!userId) {
            return { success: false, message: '로그인 해주세요.' };
        }
        const name = await this.login_auth(userId);
        const ret = await this.postActionService.community_post_delete(postId, type, userId);
        console.log(ret);
        return { success: ret.success, message: ret.message, name: name, myId: userId };
    }
};
exports.postActionController = postActionController;
__decorate([
    (0, common_1.Post)("/community/like/:postId"),
    __param(0, (0, common_1.Param)("postId")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], postActionController.prototype, "community_post_like", null);
__decorate([
    (0, common_1.Post)("/community/comment/:postId"),
    __param(0, (0, common_1.Param)("postId")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)("content")),
    __param(3, (0, common_1.Body)("parent_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String]),
    __metadata("design:returntype", Promise)
], postActionController.prototype, "community_comment_write", null);
__decorate([
    (0, common_1.Post)("/community/comment_like/:postId/:comment_id"),
    __param(0, (0, common_1.Param)("postId")),
    __param(1, (0, common_1.Param)("comment_id")),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], postActionController.prototype, "community_comment_like", null);
__decorate([
    (0, common_1.Post)("/community/comment_delete/:postId/:type/:comment_id"),
    __param(0, (0, common_1.Param)("postId")),
    __param(1, (0, common_1.Param)("comment_id")),
    __param(2, (0, common_1.Param)("type")),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], postActionController.prototype, "community_comment_delete", null);
__decorate([
    (0, common_1.Post)("/community/post_delete/:postId/:type"),
    __param(0, (0, common_1.Param)("postId")),
    __param(1, (0, common_1.Param)("type")),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], postActionController.prototype, "community_post_delete", null);
exports.postActionController = postActionController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [listView_1.listViewService,
        auth_1.authService,
        view_1.ViewService,
        postActionService_1.postActionService])
], postActionController);
//# sourceMappingURL=postActionController.js.map