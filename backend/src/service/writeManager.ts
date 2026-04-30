import { Injectable, NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import * as path from 'path';
import { DateUtils } from '../utils/dateUtils';
import {Model,Types} from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import fs from "fs";



@Injectable()
export class writeManagerService{

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

    async writer_delete(download_type:string,type:string,id:string){
        try{
         
            var file_path:string ="null";
            console.log(download_type)
                    var collection = await this.modelMap[type];
            const file = await collection?.findOne({ _id: new Types.ObjectId(id),download_type: download_type })
           
                file_path = path.join("C:\\Users\\lsh34\\Web\\fileMania\\backend", file.path);
                fs.unlinkSync(file_path);
                await collection?.deleteOne({ _id: new Types.ObjectId(id),download_type: download_type })
                collection = await this.modelMap['gyms'];
                await collection?.deleteOne({ file_id: new Types.ObjectId(id),file_type: type })
                return { success: true, message: '파일 삭제 완료' };
            
           
        }catch(error){
            console.log(error)
            
            return { success: false, message: error.message };
        }
    }



    


}