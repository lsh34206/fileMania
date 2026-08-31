import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';

  import { Injectable, NotFoundException } from '@nestjs/common';
import {Model, Types} from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { DateUtils } from 'src/utils/dateUtils';

  @WebSocketGateway({
    cors: {
      origin:[process.env.FRONTEND_URI_VALUE],
      credentials: true
    },
  })

  @Injectable()
  export class socketService implements OnGatewayConnection, OnGatewayDisconnect {


    private modelMap: Record<string, Model<any>>;
    private userSockets: Map<string, Set<string>> = new Map();
    private socketUsers: Map<string, string> = new Map();
    // gymId -> userId -> Set<socketId>
    private gymRoomUsers: Map<string, Map<string, Set<string>>> = new Map();
    // socketId -> Set<gymId>
    private socketGymRooms: Map<string, Set<string>> = new Map();
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

     @InjectModel('chatrooms')
     private readonly chatroomsModel: Model<any>,

     @InjectModel('messages')
     private readonly messagesModel: Model<any>,
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
        gymChats:this.gymChatsModel,
        chatrooms:this.chatroomsModel,
        messages:this.messagesModel
    };
    
    }




    @WebSocketServer()
    server: Server;

    private extractUserId(client: Socket): string | null {
      const cookieHeader = client.handshake.headers.cookie;
      if (!cookieHeader) {
        return null;
      }
      const match = cookieHeader
        .split(';')
        .map((c) => c.trim())
        .find((c) => c.startsWith('user='));
      if (!match) {
        return null;
      }
      return decodeURIComponent(match.split('=')[1]);
    }

    handleConnection(client: Socket) {
      const userId = this.extractUserId(client);
      if (!userId) {
        return;
      }
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId)!.add(client.id);
      this.socketUsers.set(client.id, userId);
    }

    handleDisconnect(client: Socket) {
      const userId = this.socketUsers.get(client.id);

      const gymRooms = this.socketGymRooms.get(client.id);
      if (gymRooms) {
        for (const gymId of [...gymRooms]) {
          this.removeGymPresence(client.id, gymId);
          this.broadcastGymRoomUsers(gymId);
        }
        this.socketGymRooms.delete(client.id);
      }

      if (userId) {
        const sockets = this.userSockets.get(userId);
        sockets?.delete(client.id);
        if (sockets && sockets.size === 0) {
          this.userSockets.delete(userId);
        }
      }
      this.socketUsers.delete(client.id);
    }

    forceLogout(userId: string, message: string) {
      const socketIds = this.userSockets.get(userId);
      if (!socketIds) {
        return;
      }
      for (const id of [...socketIds]) {
        this.server.to(id).emit('force_logout', { message });
        this.server.sockets.sockets.get(id)?.disconnect(true);
      }
    }

    async getOnlineUsers() {
      const userIds = [...this.userSockets.keys()];
      if (userIds.length === 0) {
        return [];
      }
      const users = await this.userModel.find({ _id: { $in: userIds } }).select('name level');
      return users.map((u: any) => ({ name: u.name, level: u.level ?? 1 }));
    }

    private addGymPresence(gymId: string, userId: string, socketId: string) {
      if (!this.gymRoomUsers.has(gymId)) {
        this.gymRoomUsers.set(gymId, new Map());
      }
      const userMap = this.gymRoomUsers.get(gymId)!;
      if (!userMap.has(userId)) {
        userMap.set(userId, new Set());
      }
      userMap.get(userId)!.add(socketId);

      if (!this.socketGymRooms.has(socketId)) {
        this.socketGymRooms.set(socketId, new Set());
      }
      this.socketGymRooms.get(socketId)!.add(gymId);
    }

    private removeGymPresence(socketId: string, gymId: string) {
      const userId = this.socketUsers.get(socketId);
      const userMap = this.gymRoomUsers.get(gymId);
      if (!userId || !userMap) {
        return;
      }
      const sockets = userMap.get(userId);
      if (!sockets) {
        return;
      }
      sockets.delete(socketId);
      if (sockets.size === 0) {
        userMap.delete(userId);
      }
      if (userMap.size === 0) {
        this.gymRoomUsers.delete(gymId);
      }
    }

    private async broadcastGymRoomUsers(gymId: string) {
      const userMap = this.gymRoomUsers.get(gymId);
      const userIds = userMap ? [...userMap.keys()] : [];
      if (userIds.length === 0) {
        this.server.to(gymId).emit('receive_room_users', []);
        return;
      }
      const users = await this.userModel.find({ _id: { $in: userIds } }).select('name level');
      this.server.to(gymId).emit(
        'receive_room_users',
        users.map((u: any) => ({ name: u.name, level: u.level ?? 1 })),
      );
    }

    @SubscribeMessage('join_gym_room')
    async joinGymRoom(
      @MessageBody() data: { gymId: string; userId: string },
      @ConnectedSocket() client: Socket,
    ) {
      client.join(data.gymId);

      const userId = this.socketUsers.get(client.id) ?? data.userId;
      if (userId) {
        this.addGymPresence(data.gymId, userId, client.id);
      }

      this.server.to(data.gymId).emit('receive_system', {
        message: '입장했습니다.',
        time: new Date(),
      });

      await this.broadcastGymRoomUsers(data.gymId);
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
        highest_bidder_price: data.bidPrice,
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
    message: `${user.name}님이 ${data.bidPrice}원 입찰`,
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


    @SubscribeMessage('join_chat_room')
    async joinChatRoom(
      @MessageBody() data: { roomId: string; userId: string },
      @ConnectedSocket() client: Socket,
    ) {
      const room = await this.chatroomsModel.findById(data.roomId);
      if (!room) {
        return { success: false, message: '존재하지 않는 채팅방입니다.' };
      }

      const isParticipant = room.participants.some(
        (p) => p.toString() === data.userId,
      );
      if (!isParticipant) {
        return { success: false, message: '참여중인 채팅방이 아닙니다.' };
      }

      client.join(`chat_${data.roomId}`);

      const users = await this.userModel
        .find({ _id: { $in: room.participants } })
        .select('name');

      const nameMap: Record<string, string> = {};
      for (const u of users) {
        nameMap[u._id.toString()] = u.name;
      }

      await this.messagesModel.updateMany(
        { room_id: room._id, sender_id: { $ne: data.userId }, isRead: false },
        { $set: { isRead: true } },
      );

      const messages = await this.messagesModel
        .find({ room_id: room._id })
        .sort({ createdAt: 1 });

      const history = messages.map((m) => ({
        ...m.toObject(),
        sender_name: nameMap[m.sender_id.toString()] ?? '알 수 없음',
      }));

      client.emit('chat_history', {
        room: room,
        participants: nameMap,
        messages: history,
      });

      return { success: true };
    }

    @SubscribeMessage('send_message')
    async sendMessage(
      @MessageBody() data: { roomId: string; userId: string; message: string },
    ) {
      if (!data.message || !data.message.trim()) {
        return { success: false, message: '메시지를 입력해주세요.' };
      }

      const room = await this.chatroomsModel.findById(data.roomId);
      if (!room) {
        return { success: false, message: '존재하지 않는 채팅방입니다.' };
      }

      const user = await this.userModel.findById(data.userId);
      if (!user) {
        return { success: false, message: '로그인 해주세요.' };
      }

      const isParticipant = room.participants.some(
        (p) => p.toString() === user._id.toString(),
      );
      if (!isParticipant) {
        return { success: false, message: '참여중인 채팅방이 아닙니다.' };
      }

      // 스키마의 createdAt default는 서버 시작 시점 값으로 고정되므로 직접 넣어준다.
      const msg = await this.messagesModel.insertOne({
        room_id: room._id,
        sender_id: user._id,
        content: data.message,
        createdAt: DateUtils.now_date(),
      });

      await this.chatroomsModel.updateOne(
        { _id: room._id },
        {
          $set: {
            last_message: data.message,
            last_message_time: DateUtils.now_date(),
          },
        },
      );

      this.server.to(`chat_${data.roomId}`).emit('receive_message', {
        ...msg.toObject(),
        sender_name: user.name,
      });

      return { success: true };
    }






  }