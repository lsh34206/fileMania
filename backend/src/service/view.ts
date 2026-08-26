import { Injectable, NotFoundException } from '@nestjs/common';
import {Model, Types} from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { catchError } from 'rxjs';
import { connected } from 'process';

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
   @InjectModel('community')
   private readonly community: Model<any>,
   @InjectModel('purchases')
   private readonly purchaseModel: Model<any>,
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
      community:this.community
  };
  
  }

    async view_file(download_type:string,type:string,id:string,user_id:string){
        try{
            var collection = await this.userModel;
            const name = user_id ? await collection?.findOne({_id: new Types.ObjectId(user_id)}) : null;
          console.log(name);

            collection = await this.modelMap[type];
            console.log(type);

            const file = await collection?.findOne({ _id: new Types.ObjectId(id), download_type:download_type })
            console.log(file)

            const writer_is_me = !!name?.name && !!file && file.uploader === name.name;
            console.log(writer_is_me)

            let purchased = true;
            if(download_type === 'paid' && file){
                if(writer_is_me){
                    purchased = true;
                }else if(user_id){
                    const purchase = await this.purchaseModel.findOne({ user_id: new Types.ObjectId(user_id), file_id: file._id });
                    purchased = !!purchase;
                }else{
                    purchased = false;
                }
            }

            return { file:file,name:name?.name ?? null,writer_is_me:writer_is_me,id:id,purchased:purchased}


        }catch(error){
            console.log(error)
            return { success: false, message: error.message }
        }
    }


    async gym_view(download_type:string,type:string,id:string,user_id:string){
      try{
          var collection = await this.userModel;
          const name = user_id ? await collection?.findOne({_id: new Types.ObjectId(user_id)}) : null;
        console.log(name);

          collection = await this.modelMap[type];
          console.log(type);

          const file = await collection?.findOne({ _id: new Types.ObjectId(id), download_type:download_type })
          console.log(file)

          const writer_is_me = !!name?.name && !!file && file.uploader === name.name;
          console.log(writer_is_me)
          collection = await this.modelMap["gymChats"];
          const chatsList = await collection.find({auction_id:file._id.toString()});
          collection = await this.modelMap["gymBids"];
          const bidsList = await collection.find({auction_id:file._id.toString()});
          collection = await this.modelMap["gyms"];
          const gym = await collection.findOne({file_id:file._id});
          return { file:file,name:name?.name ?? null,writer_is_me:writer_is_me,id:id,user_id:user_id,chatList:chatsList,bidsList:bidsList,gym:gym};

          
      }catch(error){
          console.log(error)
          return { success: false, message: error.message }
      }
  }

  async community_post_writer_is_me(viewer:string,postId:string,type:string){
      try{
        var collection = await this.modelMap["community"];

        const post = await collection.findOne({_id:new Types.ObjectId(postId),category:type});
        const uploader = (post.writer_id).toString();

        return viewer===uploader;
      }catch(error){
          console.log(error);
      }
  }

  async is_admin(viewer:string){
      if(!viewer){
          return false;
      }
      try{
          const user = await this.userModel.findById(viewer).select('role');
          return user?.role === 'admin';
      }catch(error){
          return false;
      }
  }

  async community_post_count_view(type:string,id:string,name:string,viewer:string){
    try{
       var collection = await this.modelMap["community"];

       const post = await collection.findOne({_id:new Types.ObjectId(id),category:type});
       const update = await collection.updateOne({_id:new Types.ObjectId(id),category:type},{$inc:{view_count:1}});
      const post_writer_is_me = await this.community_post_writer_is_me(viewer,id,type);
      const is_admin = await this.is_admin(viewer);

       return {post:post,name:name,writer_is_me:post_writer_is_me,is_admin:is_admin,message:"불러오기 성공"};

    }catch(error){
return {message:error,name:name};
    }
 }

 async community_post_view(type:string,id:string,name:string,viewer:string){
  try{
     var collection = await this.modelMap["community"];

     const post = await collection.findOne({_id:new Types.ObjectId(id),category:type});

     const post_writer_is_me = await this.community_post_writer_is_me(viewer,id,type);
     const is_admin = await this.is_admin(viewer);

     return {post:post,name:name,writer_is_me:post_writer_is_me,is_admin:is_admin,message:"불러오기 성공"};

  }catch(error){
return {message:error,name:name};
  }
}
}