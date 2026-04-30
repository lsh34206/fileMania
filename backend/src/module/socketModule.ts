import { Module } from "@nestjs/common";
import { socketService} from "src/service/socket";
import { MongooseModule } from "@nestjs/mongoose";
import {
  usersSchema,
  filesSchema,
  gymsSchema,
  gymResultsSchema,
  gymBidsSchema,
  gymChatsSchema,
} from "src/db/schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "users", schema: usersSchema },
      { name: "image", schema: filesSchema },
      { name: "audio", schema: filesSchema },
      { name: "video", schema: filesSchema },
      { name: "app", schema: filesSchema },
      { name: "document", schema: filesSchema },
      { name: "gyms", schema: gymsSchema },
      { name: "gymResults", schema: gymResultsSchema },
      { name: "gymBids", schema: gymBidsSchema },
      { name: "gymChats", schema: gymChatsSchema },
    ]),
  ],
    providers: [socketService],exports:[socketService]
  })

export class socketModule{
    
}