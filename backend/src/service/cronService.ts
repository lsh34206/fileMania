import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";


@Injectable()
export class cornService{
    
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

    @Cron("*/1 * * * *")
    async gymEndTimeCheck(){
try{
      const now = new Date();
      const gyms = await this.gymsModel.find({end_time:{$lte:now},status:"active"});

      for(const gym of gyms){
        if(gym.end_time < now){
          await this.gymsModel.updateOne({_id:new Types.ObjectId(gym._id)},{$set:{status:"ended"}});
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