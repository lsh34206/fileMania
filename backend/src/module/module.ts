import {  authService} from "src/service/auth";
import {  UploadService} from "src/service/fileUpload";
import {  listViewService} from "src/service/listView";
import { mainController } from "../controller/mainController";
import { fileController } from "../controller/fileController";
import { Module } from "@nestjs/common";
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from "path";
import { viewController } from "src/controller/viewController";
import { socketService } from "src/service/socket";
import {MongooseModule} from "@nestjs/mongoose"
import { writeManagerController } from "src/controller/writeManagerController";
import { writeManagerService } from "src/service/writeManager";
import { downloadService } from "src/service/download";
import { downloadController } from "src/controller/downloadController";
import { ViewService } from "src/service/view";
import { socketModule } from "./socketModule";
import { usersSchema,filesSchema, gymsSchema, gymResultsSchema, gymBidsSchema, gymChatsSchema } from "src/db/schema";
const fileRoot = ServeStaticModule.forRoot({
    rootPath: join(process.cwd(), 'files'),
    serveRoot: '/files',
  });
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
,{name:'gymChats',schema:gymChatsSchema}
])

@Module(
  {
    controllers: [mainController,fileController,viewController,writeManagerController,downloadController],
  providers:[authService,UploadService,listViewService,writeManagerService,ViewService,downloadService],
  imports:[mongoModule,mongoSchema,fileRoot,socketModule]
}
)

export class mainModule{
   constructor(){
     console.log("모듈 로드 완료");
   }
}
