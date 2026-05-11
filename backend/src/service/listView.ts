import {BadRequestException, Injectable} from "@nestjs/common"
import { DateUtils } from "../utils/dateUtils";
import {Model, Types} from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";

@Injectable()
export class listViewService{

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
    
    ){
      
      this.modelMap = {
      users:this.userModel,
      image:this.imageModel,
      audio:this.audioModel,
      video:this.videoModel,
      document:this.documentModel,
      app:this.appModel
    
    
    };
    
    }

    async gym_view(type:string,name:string){
        try{
      
        if(!['image','video','audio','document','app'].includes(type)){
            return { files: [], id: [] }
        }
        var collection = await this.modelMap[type];
        const files = await collection?.find({ download_type: 'gym', type })

        if(!files){
            throw new BadRequestException("파일없음");
        }

        const id = files.map(f => new Types.ObjectId(f._id))
        const end_time = files.map(f => DateUtils.date_to_string(f.end_time));
        const start_price = files.map(f => f.start_price);
   
   
        return { files, id ,name:name, end_time:DateUtils.date_to_string( end_time), start_price:start_price};
    }catch(error){
        console.log(error)
        return { success: false, message: error }
    }
}

async free_view(type:string,name:string){
try{
    var writer_is_me:boolean = false;
        
            if(!['image','video','audio','document','app'].includes(type)){
                return { files: [], id: [] };
            }
            var collection = this.modelMap[type];
            const files = await collection?.find({ download_type: 'free', type })

            if(!files){
                throw new BadRequestException("파일없음");
            }

            const id = files.map(f =>new Types.ObjectId(f._id))
          
            return { files:files, id:id ,name:name}
        }catch(error){
            console.log(error)
            return { success: false, message: error };
        }
}


async paid_view(type: string, name: string) {
    try {
      if (!['image', 'video', 'audio', 'document', 'app'].includes(type)) {
        return { files: [], id: [], name };
      }
  
      const collection = this.modelMap[type];
  
      const files = await collection
        .find({ download_type: 'paid', type })
        .exec();

      const id = files.map((f) => f._id.toString());
  
      return { files, id, name };
    } catch (error) {
      console.log(error);
      return { success: false, message: error.message };
    }
  }




}



