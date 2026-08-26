import { Injectable, NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import * as path from 'path';
import { DateUtils } from '../utils/dateUtils';
import {Model,Types} from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import fs from "fs";
import { xpService } from "src/service/xpService";



@Injectable()
export class writeManagerService{

    private modelMap: Record<string, Model<any>>;
    constructor(
     private readonly xpService: xpService,

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
        private readonly community: Model<any>
     
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


    async community_write_ok(writer_id:string,type:string,
        data:string){
        try{

            var collection = await this.modelMap["users"];
            const post_data = JSON.parse(data);
            const writer_info = await collection.findOne({_id:new Types.ObjectId(writer_id)});
            if(!writer_info){
                return { success:false, message: "로그인 해주세요." };
            }
            if(type === 'notice' && writer_info.role !== 'admin'){
                return { success:false, message: "공지사항은 관리자만 작성할 수 있습니다." };
            }
            collection = await this.modelMap["community"];
            const write_ok = await collection.insertOne({category:type,writer:writer_info.name,writer_id:writer_info._id,title:post_data.title,content:post_data.content});

            await this.userModel.updateOne({_id:writer_info._id},{$inc:{writer_count:1}});

            await this.xpService.addXp(writer_id, 3);

            return { success:true, message: "게시글 작성 완료" };

        }catch(err){
            console.log(err);

            return { success: false, message: err.message };
        }
    }

    async community_edit_ok(writer_id:string,postId:string,type:string,data:string){
        try{
            if(!Types.ObjectId.isValid(postId)){
                return { success: false, message: '잘못된 요청입니다.' };
            }
            if(!writer_id){
                return { success: false, message: '로그인 해주세요.' };
            }

            const post_data = JSON.parse(data);
            if(!post_data.title || !post_data.title.trim()){
                return { success: false, message: '제목을 입력해주세요.' };
            }
            if(!post_data.content || !post_data.content.trim()){
                return { success: false, message: '내용을 입력해주세요.' };
            }

            const collection = this.modelMap["community"];
            const post = await collection.findOne({ _id: new Types.ObjectId(postId), category: type });
            if(!post){
                return { success: false, message: '게시글을 찾을 수 없습니다.' };
            }
            if(post.writer_id.toString() !== writer_id){
                return { success: false, message: '수정 권한이 없습니다.' };
            }

            const newCategory = ['talk','share','question'].includes(post_data.category)
                ? post_data.category
                : post.category;

            await collection.updateOne(
                { _id: new Types.ObjectId(postId), category: type },
                { $set: { title: post_data.title, content: post_data.content, category: newCategory } },
            );

            return { success: true, message: '게시글 수정 완료', category: newCategory };

        }catch(err){
            console.log(err);
            return { success: false, message: err.message };
        }
    }

    async file_edit_ok(user_id:string,type:string,id:string,data:any){
        try{
            if(!['image','video','audio','document','app'].includes(type)){
                return { success: false, message: '잘못된 파일 종류입니다.' };
            }
            if(!Types.ObjectId.isValid(id)){
                return { success: false, message: '잘못된 요청입니다.' };
            }
            if(!user_id){
                return { success: false, message: '로그인 해주세요.' };
            }

            const user = await this.userModel.findById(user_id);
            if(!user){
                return { success: false, message: '로그인 해주세요.' };
            }

            if(!data.title || !String(data.title).trim()){
                return { success: false, message: '제목을 입력해주세요.' };
            }
            if(!data.description || !String(data.description).trim()){
                return { success: false, message: '설명을 입력해주세요.' };
            }

            const collection = this.modelMap[type];
            const file = await collection?.findOne({ _id: new Types.ObjectId(id) });
            if(!file){
                return { success: false, message: '파일을 찾을 수 없습니다.' };
            }

            if(file.uploader !== user.name){
                return { success: false, message: '수정 권한이 없습니다.' };
            }

            const update:any = {
                title: data.title,
                description: data.description,
            };

            if(file.download_type === 'paid'){
                const price = Number(data.price);
                if(!Number.isFinite(price) || price < 0){
                    return { success: false, message: '가격을 올바르게 입력해주세요.' };
                }
                update.price = price;
            }

            await collection.updateOne({ _id: new Types.ObjectId(id) }, { $set: update });

            return { success: true, message: '파일 정보 수정 완료' };

        }catch(error){
            console.log(error);
            return { success: false, message: error.message };
        }
    }

    async writer_delete(download_type:string,type:string,id:string,user_id:string){
        try{
            if(!['image','video','audio','document','app'].includes(type)){
                return { success: false, message: '잘못된 파일 종류입니다.' };
            }
            if(!Types.ObjectId.isValid(id)){
                return { success: false, message: '잘못된 요청입니다.' };
            }
            if(!user_id){
                return { success: false, message: '로그인 해주세요.' };
            }

            const user = await this.userModel.findById(user_id);
            if(!user){
                return { success: false, message: '로그인 해주세요.' };
            }

            var collection = this.modelMap[type];
            const file = await collection?.findOne({ _id: new Types.ObjectId(id),download_type: download_type })
            if(!file){
                return { success: false, message: '파일을 찾을 수 없습니다.' };
            }

            if(file.uploader !== user.name){
                return { success: false, message: '삭제 권한이 없습니다.' };
            }

            const file_path = path.join("C:\\Users\\lsh34\\Web\\fileMania\\backend", file.path);
            if(fs.existsSync(file_path)){
                fs.unlinkSync(file_path);
            }
            await collection?.deleteOne({ _id: new Types.ObjectId(id),download_type: download_type })
            collection = this.modelMap['gyms'];
            await collection?.deleteOne({ file_id: new Types.ObjectId(id),file_type: type })

            collection = this.modelMap['gymChats'];
            await collection?.deleteMany({ auction_id: new Types.ObjectId(id) })

            collection = this.modelMap['gymBids'];
            await collection?.deleteMany({ auction_id: new Types.ObjectId(id) })



            return { success: true, message: '파일 삭제 완료' };


        }catch(error){
            console.log(error)

            return { success: false, message: error.message };
        }
    }



    


}