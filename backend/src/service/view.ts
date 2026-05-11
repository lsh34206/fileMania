import { Injectable, NotFoundException } from '@nestjs/common';
import {Model, Types} from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class ViewService {

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

    async view_file(download_type:string,type:string,id:string,user_id:string){
        try{
            var writer_is_me:boolean | null = null;
            var collection = await this.userModel;
            const name = await collection?.findOne({_id: new Types.ObjectId(user_id)});
          console.log(name);
            
            if(name !== null){
             writer_is_me = true;
            }else{
              writer_is_me = false;
            }

           
            collection = await this.modelMap[type];
            console.log(type);
            
            const file = await collection?.findOne({ _id: new Types.ObjectId(id), download_type:download_type })
            console.log(file)
            console.log(writer_is_me)

        
            return { file:file,name:name.name,writer_is_me:writer_is_me,id:id}

            
        }catch(error){
            console.log(error)
            return { success: false, message: error.message }
        }
    }


    async gym_view(download_type:string,type:string,id:string,user_id:string){
      try{
          var writer_is_me:boolean | null = null;
          var collection = await this.userModel;
          const name = await collection?.findOne({_id: new Types.ObjectId(user_id)});
        console.log(name);
          
          if(name !== null){
           writer_is_me = true;
          }else{
            writer_is_me = false;
          }

         
          collection = await this.modelMap[type];
          console.log(type);
          
          const file = await collection?.findOne({ _id: new Types.ObjectId(id), download_type:download_type })
          console.log(file)
          console.log(writer_is_me)
          collection = await this.modelMap["gymChats"];
          const chatsList = await collection.find({auction_id:file._id.toString()});
          collection = await this.modelMap["gymBids"];
          const bidsList = await collection.find({auction_id:file._id.toString()});
          collection = await this.modelMap["gyms"];
          const gym = await collection.findOne({file_id:file._id});
          return { file:file,name:name.name,writer_is_me:writer_is_me,id:id,user_id:user_id,chatList:chatsList,bidsList:bidsList,gym:gym};

          
      }catch(error){
          console.log(error)
          return { success: false, message: error.message }
      }
  }
}