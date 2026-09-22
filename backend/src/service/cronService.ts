import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { makeIdUtils } from "../utils/makeId";
import { DateUtils } from "src/utils/dateUtils";
import { xpService } from "src/service/xpService";
import { socketService } from "src/service/socket";
import { logService } from "src/service/logService";


@Injectable()
export class cornService{
    
    private modelMap: Record<string, Model<any>>;
    constructor(
     private readonly xpService: xpService,
     private readonly socketService: socketService,
     private readonly logService: logService,

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

    @Cron("*/1 * * * *")
    async gymEndTimeCheck(){
try{
      const now = new Date();
      const gyms = await this.gymsModel.find({end_time:{$lte:now},status:"active"});

      for(const gym of gyms){
        if(gym.end_time < now){
          await this.gymsModel.updateOne({_id:new Types.ObjectId(gym._id)},{$set:{status:"ended"}});
          await this.gymResultsModel.insertOne({
            auction_id:new Types.ObjectId(gym._id),
            winner_id:gym.highest_bidder_id ? new Types.ObjectId(gym.highest_bidder_id) : null,
            winner_name:gym.highest_bidder_name,
            final_price:gym.highest_bidder_price,

            seller_id:new Types.ObjectId(gym.seller_id),
            file_id:new Types.ObjectId(gym.file_id),
            file_type:gym.file_type
          });

if(gym.highest_bidder_id){
  const user = await this.userModel.findOne({_id:new Types.ObjectId(gym.highest_bidder_id)});

  await this.xpService.addXp(gym.highest_bidder_id.toString(), 15);

  var userMessagesList = user?.massege_list ?? [];
  userMessagesList.push({
    id:makeIdUtils.makeId(),
    message:`${gym.title} 경매에 낙찰되었습니다. 축하드립니다!\n 결제를 진행할 채팅방이 추가되었습니다.`,
    sender_id:gym.seller_id,
    sender_name:gym.seller_name,
    receiver_id:gym.highest_bidder_id,
    receiver_name:gym.highest_bidder_name,
    createdAt:new Date()
  });

  await this.modelMap['chatrooms'].insertOne({
      type:"경매",
      auction_id:gym._id,
      createAt:DateUtils.now_date(),
      participants:[user._id,gym.seller_id]
  });

  await this.userModel.updateOne({_id:new Types.ObjectId(gym.seller_id)},{
    $set:{
      massege_list:userMessagesList
    }
  });
}

          this.socketService.notifyGymEnded(gym.file_id.toString(),{
            winner_id:gym.highest_bidder_id ? gym.highest_bidder_id.toString() : null,
            winner_name:gym.highest_bidder_name,
            final_price:gym.highest_bidder_price,
            title:gym.title
          });

          if(gym.highest_bidder_id){
            await this.logService.write('auction', `"${gym.title}" 경매가 종료되어 ${gym.highest_bidder_name}님이 ${gym.highest_bidder_price.toLocaleString()}원에 낙찰받았습니다.`, gym.highest_bidder_id.toString(), gym.highest_bidder_name, { auction_id: gym.file_id.toString() });
          }else{
            await this.logService.write('auction', `"${gym.title}" 경매가 입찰자 없이 유찰되었습니다.`, null, '', { auction_id: gym.file_id.toString() });
          }
       }
      }
      console.log("Gym end time check completed",gyms.length);
      return {success:true,message:"Gym end time check completed"};

    }catch(error){
      console.log(error);
      return {success:false,message:error};
    }


    }
}