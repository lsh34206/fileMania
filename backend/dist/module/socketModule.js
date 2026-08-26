"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketModule = void 0;
const common_1 = require("@nestjs/common");
const socket_1 = require("../service/socket");
const mongoose_1 = require("@nestjs/mongoose");
const schema_1 = require("../db/schema");
let socketModule = class socketModule {
};
exports.socketModule = socketModule;
exports.socketModule = socketModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: "users", schema: schema_1.usersSchema },
                { name: "image", schema: schema_1.filesSchema },
                { name: "audio", schema: schema_1.filesSchema },
                { name: "video", schema: schema_1.filesSchema },
                { name: "app", schema: schema_1.filesSchema },
                { name: "document", schema: schema_1.filesSchema },
                { name: "gyms", schema: schema_1.gymsSchema },
                { name: "gymResults", schema: schema_1.gymResultsSchema },
                { name: "gymBids", schema: schema_1.gymBidsSchema },
                { name: "gymChats", schema: schema_1.gymChatsSchema },
                { name: "chatrooms", schema: schema_1.chatroomSchema },
                { name: "messages", schema: schema_1.messageSchema },
            ]),
        ],
        providers: [socket_1.socketService], exports: [socket_1.socketService]
    })
], socketModule);
//# sourceMappingURL=socketModule.js.map