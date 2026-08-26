import {  authService} from "src/service/auth";
import {  UploadService} from "src/service/fileUpload";
import {  listViewService} from "src/service/listView";
import { mainController } from "../controller/mainController";
import { fileController } from "../controller/fileController";
import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { SessionStatusMiddleware } from "src/middleware/sessionStatus.middleware";
import { viewController } from "src/controller/viewController";
import { socketService } from "src/service/socket";
import {MongooseModule} from "@nestjs/mongoose"
import { writeManagerController } from "src/controller/writeManagerController";
import { writeManagerService } from "src/service/writeManager";
import { downloadService } from "src/service/download";
import { downloadController } from "src/controller/downloadController";
import { ViewService } from "src/service/view";
import { socketModule } from "./socketModule";
import { postActionController } from "src/controller/postActionController";
import { usersSchema,filesSchema, gymsSchema, gymResultsSchema, gymBidsSchema, gymChatsSchema, communitySchema, chatroomSchema, messageSchema, pointChargeSchema, purchaseSchema } from "src/db/schema";
import { ScheduleModule } from "@nestjs/schedule";
import { cornService } from "src/service/cronService";
import { postActionService } from "src/service/postActionService";
import { messageController } from "src/controller/messageController";
import { messageService } from "src/service/messageService";
import { chatController } from "src/controller/chatController";
import { chatService } from "src/service/chatService";
import { paymentController } from "src/controller/paymentController";
import { paymentService } from "src/service/paymentService";
import { purchaseController } from "src/controller/purchaseController";
import { purchaseService } from "src/service/purchaseService";
import { mediaController } from "src/controller/mediaController";
import { xpService } from "src/service/xpService";
import { adminController } from "src/controller/adminController";
import { adminService } from "src/service/adminService";
const mongoModule = MongooseModule.forRoot("mongodb+srv://lsh34206:shhs1004@cluster0.amaaaue.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",{dbName:"fileMania",connectionFactory: (connection) => {
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
}});

const mongoSchema = MongooseModule.forFeature([{name:'users',schema:usersSchema},{name:'image',schema:filesSchema},
  {name:'audio',schema:filesSchema},{name:'video',schema:filesSchema},{name:'document',schema:filesSchema},
  {name:'app',schema:filesSchema},{name:'gyms',schema:gymsSchema},{name:'gymResults',schema:gymResultsSchema},{name:'gymBids',schema:gymBidsSchema}
,{name:'gymChats',schema:gymChatsSchema},{name:'community',schema:communitySchema},{name:'chatrooms',schema:chatroomSchema},{name:'messages',schema:messageSchema}
,{name:'pointCharges',schema:pointChargeSchema}
,{name:'purchases',schema:purchaseSchema}
])

@Module(
  {
    controllers: [mainController,fileController,
      viewController,writeManagerController,
      downloadController,postActionController,messageController,chatController,paymentController,purchaseController,mediaController,adminController],
  providers:[authService,UploadService,
    listViewService,writeManagerService,
    ViewService,downloadService,cornService,postActionService,messageService,chatService,paymentService,purchaseService,xpService,adminService,SessionStatusMiddleware],
  imports:[mongoModule,mongoSchema,
    socketModule,
    ScheduleModule.forRoot()]
}
)

export class mainModule implements NestModule{
   constructor(){
     console.log("모듈 로드 완료");
   }

   configure(consumer: MiddlewareConsumer){
     consumer.apply(SessionStatusMiddleware).forRoutes('*');
   }
  }