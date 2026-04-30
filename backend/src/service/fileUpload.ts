  import { Injectable, NotFoundException } from '@nestjs/common';
  import { ObjectId } from 'mongodb';
  import { DateUtils } from '../utils/dateUtils';
  import {Model, Types} from "mongoose";
  import { InjectModel } from "@nestjs/mongoose";

  @Injectable()
  export class UploadService {

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


  async uploadFile({
    file,
    data,
    userId,
    type,
  }: {
    file: Express.Multer.File;
    data: any;
    userId: string;
    type: string;
  }) {
    const usersCollection = this.modelMap["users"];

    const uploaderUser = await usersCollection?.findOne({
      _id: new Types.ObjectId(userId),
    });

    if (!uploaderUser) {
      throw new NotFoundException('유저 없음');
    }

    const filePath = `/files/${data.type}/${file.filename}`;
    const price = data.download_type === 'paid' ? data.price : 0;
    const start_price = data.download_type === 'gym' ? data.start_price : 0;
    const end_time =
      data.download_type === 'gym'
        ? new Date(Date.now() + data.end_time * 60 * 1000)
        : null;

    const targetCollection = this.modelMap[data.type];

    const result = await targetCollection.insertOne({
      download_type: data.download_type,
      download_count: 0,
      path: filePath,
      title: data.title,
      description: data.description,
      type: data.type,
      price,
      size: (file.size / (1024 * 1024)).toFixed(2) + 'MB',
      uploader: uploaderUser.name,
      start_price,
      end_time,
    });
if(data.download_type==='gym'){

  //gyms
  var collection = await this.modelMap["gyms"];
   collection.insertOne({file_id:result._id,
    file_type:data.type,
    title:data.title,
    description:data.description,
    seller_id:uploaderUser._id,
    seller_name:uploaderUser.name,
    start_price:data.start_price,
    end_time:end_time,

  });


}
    return {
      success: true,
      message: '파일 업로드 완료',
    };
  }
}