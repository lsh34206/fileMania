import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';

  import { Injectable, NotFoundException } from '@nestjs/common';
import {Model, Types} from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

  @WebSocketGateway({
    cors: {
      origin: ['http://localhost:5173',"https://2359-124-194-149-252.ngrok-free.app"],
      credentials: true
    },
  })

  @Injectable()
  export class socketService {


    private modelMap: Record<string, Model<any>>;
    constructor(
     @InjectModel('users')
     private readonly userModel: Model<any>,
    
     @InjectModel('image')
     private readonly imageModel: Model<any>,
    
     @InjectModel('audio')
     private readonly audioModel: Model<any>,
    
     @InjectModel('video')
     private readonly videoModel: Model<any>,
    
     @InjectModel('app')
     private readonly appModel: Model<any>,
    
     @InjectModel('document')
     private readonly documentModel: Model<any>,
    
     @InjectModel('gyms')
     private readonly gymsModel: Model<any>,
  
  
     @InjectModel('gymResults')
     private readonly gymResultsModel: Model<any>,
  
  
     @InjectModel('gymBids')
     private readonly gymBidsModel: Model<any>,
  
     @InjectModel('gymChats')
     private readonly gymChatsModel: Model<any>,
    ){
      
      this.modelMap = {
      users:this.userModel,
      image:this.imageModel,
      audio:this.audioModel,
      video:this.videoModel,
      document:this.documentModel,
      app:this.appModel,
    
      gyms:this.gymsModel,
        gymResults:this.gymResultsModel,
        gymBids:this.gymBidsModel,
        gymChats:this.gymChatsModel
    };
    
    }




    @WebSocketServer()
    server: Server;
  
    @SubscribeMessage('join_gym_room')
    async joinGymRoom(
      @MessageBody() data: { gymId: string; userId: string },
      @ConnectedSocket() client: Socket,
    ) {
      client.join(data.gymId);
    
      this.server.to(data.gymId).emit('receive_system', {
        message: '입장했습니다.',
        time: new Date(),
      });
    }
    @SubscribeMessage('send_chat')
    async sendChat(
      @MessageBody()
      data: {
        gymId: string;
        userId: string;
        message: string;
      },
    ) {
      const user = await this.userModel.findById(data.userId);
    
      const chat = await this.gymChatsModel.insertOne({
        auction_id: data.gymId,
        sender_id: user._id,
        sender_name: user.name,
        message: data.message,
        message_type: 'chat',
        room_id:data.gymId,
      });
    
      this.server.to(data.gymId).emit('receive_chat', chat);
    }


    @SubscribeMessage('send_bid')
async sendBid(
  @MessageBody()
  data: {
    gymId: string;
    userId: string;
    bidPrice: number;
  },
) {
  const gym = await this.gymsModel.findOne({file_id:data.gymId});

  if (!gym || gym.status !== 'active') {
    return { success: false, message: '진행중인 경매가 아님' };
  }

  if (new Date(gym.end_time).getTime() < Date.now()) {
    return { success: false, message: '이미 종료된 경매임' };
  }

  if (data.bidPrice < gym.current_price + gym.min_bid_unit) {
    return { success: false, message: '입찰가가 너무 낮음' };
  }

  const user = await this.userModel.findById(data.userId);

  await this.gymsModel.updateOne(
    { file_id: data.gymId },
    {
      $set: {
        current_price: data.bidPrice,
        highest_bidder_id: user._id,
        highest_bidder_name: user.name,
      },
      $inc: { bid_count: 1 },
    },
  );

  const bid = await this.gymBidsModel.insertOne({
    auction_id: data.gymId,
    bidder_id: user._id,
    bidder_name: user.name,
    bid_price: data.bidPrice,
    room_id:data.gymId,
  });

  const bidChat = await this.gymChatsModel.insertOne({
    auction_id: data.gymId,
    sender_id: user._id,
    sender_name: user.name,
    message: `${user.name}님이 ${data.bidPrice*100}원 입찰`,
    message_type: 'bid',
    bid_price: data.bidPrice,
    room_id:data.gymId,
  });

  this.server.to(data.gymId).emit('receive_bid', {
    bid,
    current_price: data.bidPrice,
    highest_bidder_name: user.name,
  });

  this.server.to(data.gymId).emit('receive_chat', bidChat);

  return { success: true };
}






  }