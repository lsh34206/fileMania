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
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainModule = void 0;
const auth_1 = require("../service/auth");
const fileUpload_1 = require("../service/fileUpload");
const listView_1 = require("../service/listView");
const mainController_1 = require("../controller/mainController");
const fileController_1 = require("../controller/fileController");
const common_1 = require("@nestjs/common");
const sessionStatus_middleware_1 = require("../middleware/sessionStatus.middleware");
const viewController_1 = require("../controller/viewController");
const mongoose_1 = require("@nestjs/mongoose");
const writeManagerController_1 = require("../controller/writeManagerController");
const writeManager_1 = require("../service/writeManager");
const download_1 = require("../service/download");
const downloadController_1 = require("../controller/downloadController");
const view_1 = require("../service/view");
const socketModule_1 = require("./socketModule");
const postActionController_1 = require("../controller/postActionController");
const schema_1 = require("../db/schema");
const schedule_1 = require("@nestjs/schedule");
const cronService_1 = require("../service/cronService");
const postActionService_1 = require("../service/postActionService");
const messageController_1 = require("../controller/messageController");
const messageService_1 = require("../service/messageService");
const chatController_1 = require("../controller/chatController");
const chatService_1 = require("../service/chatService");
const paymentController_1 = require("../controller/paymentController");
const paymentService_1 = require("../service/paymentService");
const purchaseController_1 = require("../controller/purchaseController");
const purchaseService_1 = require("../service/purchaseService");
const mediaController_1 = require("../controller/mediaController");
const xpService_1 = require("../service/xpService");
const adminController_1 = require("../controller/adminController");
const adminService_1 = require("../service/adminService");
const mongoModule = mongoose_1.MongooseModule.forRoot("mongodb+srv://lsh34206:shhs1004@cluster0.amaaaue.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", { dbName: "fileMania", connectionFactory: (connection) => {
        console.log("loaded");
        connection.on('connected', () => {
            console.log('MongoDB connected');
        });
        connection.on('error', (err) => {
            console.error('MongoDB error:', err);
        });
        connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });
        return connection;
    } });
const mongoSchema = mongoose_1.MongooseModule.forFeature([{ name: 'users', schema: schema_1.usersSchema }, { name: 'image', schema: schema_1.filesSchema },
    { name: 'audio', schema: schema_1.filesSchema }, { name: 'video', schema: schema_1.filesSchema }, { name: 'document', schema: schema_1.filesSchema },
    { name: 'app', schema: schema_1.filesSchema }, { name: 'gyms', schema: schema_1.gymsSchema }, { name: 'gymResults', schema: schema_1.gymResultsSchema }, { name: 'gymBids', schema: schema_1.gymBidsSchema },
    { name: 'gymChats', schema: schema_1.gymChatsSchema }, { name: 'community', schema: schema_1.communitySchema }, { name: 'chatrooms', schema: schema_1.chatroomSchema }, { name: 'messages', schema: schema_1.messageSchema },
    { name: 'pointCharges', schema: schema_1.pointChargeSchema },
    { name: 'purchases', schema: schema_1.purchaseSchema }
]);
let mainModule = class mainModule {
    constructor() {
        console.log("모듈 로드 완료");
    }
    configure(consumer) {
        consumer.apply(sessionStatus_middleware_1.SessionStatusMiddleware).forRoutes('*');
    }
};
exports.mainModule = mainModule;
exports.mainModule = mainModule = __decorate([
    (0, common_1.Module)({
        controllers: [mainController_1.mainController, fileController_1.fileController,
            viewController_1.viewController, writeManagerController_1.writeManagerController,
            downloadController_1.downloadController, postActionController_1.postActionController, messageController_1.messageController, chatController_1.chatController, paymentController_1.paymentController, purchaseController_1.purchaseController, mediaController_1.mediaController, adminController_1.adminController],
        providers: [auth_1.authService, fileUpload_1.UploadService,
            listView_1.listViewService, writeManager_1.writeManagerService,
            view_1.ViewService, download_1.downloadService, cronService_1.cornService, postActionService_1.postActionService, messageService_1.messageService, chatService_1.chatService, paymentService_1.paymentService, purchaseService_1.purchaseService, xpService_1.xpService, adminService_1.adminService, sessionStatus_middleware_1.SessionStatusMiddleware],
        imports: [mongoModule, mongoSchema,
            socketModule_1.socketModule,
            schedule_1.ScheduleModule.forRoot()]
    }),
    __metadata("design:paramtypes", [])
], mainModule);
//# sourceMappingURL=module.js.map