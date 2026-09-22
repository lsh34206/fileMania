import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Model } from "mongoose";
import { logService } from "./logService";
export declare class socketService implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly logService;
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
    constructor(logService: logService, userModel: Model<any>, imageModel: Model<any>, audioModel: Model<any>, videoModel: Model<any>, appModel: Model<any>, documentModel: Model<any>, gymsModel: Model<any>, gymResultsModel: Model<any>, gymBidsModel: Model<any>, gymChatsModel: Model<any>, chatroomsModel: Model<any>, messagesModel: Model<any>);
    server: Server;
    private extractUserId;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    notifyGymEnded(gymId: string, payload: {
        winner_id: string | null;
        winner_name: string;
        final_price: number;
        title: string;
    }): void;
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
    }, client: Socket): Promise<{
        success: boolean;
        message: string;
    } | undefined>;
    sendBid(data: {
        gymId: string;
        userId: string;
        bidPrice: number;
    }, client: Socket): Promise<{
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
    }, client: Socket): Promise<{
        success: boolean;
        message: string;
    } | {
        success: boolean;
        message?: undefined;
    }>;
}
