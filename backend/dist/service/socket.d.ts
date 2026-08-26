import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Model } from "mongoose";
export declare class socketService implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly userModel;
    private readonly imageModel;
    private readonly audioModel;
    private readonly videoModel;
    private readonly appModel;
    private readonly documentModel;
    private readonly gymsModel;
    private readonly gymResultsModel;
    private readonly gymBidsModel;
    private readonly gymChatsModel;
    private readonly chatroomsModel;
    private readonly messagesModel;
    private modelMap;
    private userSockets;
    private socketUsers;
    private gymRoomUsers;
    private socketGymRooms;
    constructor(userModel: Model<any>, imageModel: Model<any>, audioModel: Model<any>, videoModel: Model<any>, appModel: Model<any>, documentModel: Model<any>, gymsModel: Model<any>, gymResultsModel: Model<any>, gymBidsModel: Model<any>, gymChatsModel: Model<any>, chatroomsModel: Model<any>, messagesModel: Model<any>);
    server: Server;
    private extractUserId;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    forceLogout(userId: string, message: string): void;
    getOnlineUsers(): Promise<{
        name: any;
        level: any;
    }[]>;
    private addGymPresence;
    private removeGymPresence;
    private broadcastGymRoomUsers;
    joinGymRoom(data: {
        gymId: string;
        userId: string;
    }, client: Socket): Promise<void>;
    sendChat(data: {
        gymId: string;
        userId: string;
        message: string;
    }): Promise<void>;
    sendBid(data: {
        gymId: string;
        userId: string;
        bidPrice: number;
    }): Promise<{
        success: boolean;
        message: string;
    } | {
        success: boolean;
        message?: undefined;
    }>;
    joinChatRoom(data: {
        roomId: string;
        userId: string;
    }, client: Socket): Promise<{
        success: boolean;
        message: string;
    } | {
        success: boolean;
        message?: undefined;
    }>;
    sendMessage(data: {
        roomId: string;
        userId: string;
        message: string;
    }): Promise<{
        success: boolean;
        message: string;
    } | {
        success: boolean;
        message?: undefined;
    }>;
}
