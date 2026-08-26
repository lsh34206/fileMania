import { Injectable, NotFoundException } from '@nestjs/common';
import {Model, Types} from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { DateUtils } from 'src/utils/dateUtils';
import { xpService } from 'src/service/xpService';

@Injectable()
export class postActionService {

  private modelMap: Record<string, Model<any>>;
  constructor(
   private readonly xpService: xpService,

   @InjectModel('users')
   private readonly userModel: Model<any>,
   @InjectModel('community')
   private readonly community: Model<any>,
  ){
    
    this.modelMap = {

      users:this.userModel,
      community:this.community
  };
  
  }


  async community_post_like(postId:string,userId:string){
    try{
     
      var collection = await this.modelMap["community"];
      const post = await collection.findOne({_id:new Types.ObjectId(postId)});
      if(!post){
        return {message:"게시글을 찾을 수 없습니다."};
      }
    var like_count = post.like_count;
      const like_list = post.like_list;
      if(like_list.includes(userId)){
       const like_result = like_list.filter(like => like !== userId);
        const ret = await collection.updateOne({_id:new Types.ObjectId(postId)},{$set:{like_list:like_result},$inc:{like_count:-1}});
        like_count--;
      }else{
        const like_result = [...like_list,userId];
        const ret = await collection.updateOne({_id:new Types.ObjectId(postId)},{$set:{like_list:like_result},$inc:{like_count:1}});
        like_count++;
        if(post.writer_id.toString() !== userId){
          await this.xpService.addXp(post.writer_id.toString(), 3);
        }
      }
     return {like_count:like_count,message:"좋아요 성공"};
    }catch(error){
      return {message:error};
    }
  }

  new_id(){
    const id = `${Date.now()}-${Math.floor(Math.random() * 100000)}`

    return id;
  }

  async community_post_delete(postId:string,type:string,userId:string){
    try{

      var collection = await this.modelMap["community"];
      const post = await collection.findOne({_id:new Types.ObjectId(postId),category:type});
      if(!post){
        return {success:false,message:"게시글을 찾을 수 없습니다."};
      }
      const requester = await this.modelMap["users"].findById(userId);
      const isOwner = post.writer_id.toString() === userId;
      const isAdmin = requester?.role === 'admin';
      if(!isOwner && !isAdmin){
        return {success:false,message:"삭제 권한이 없습니다."};
      }
      const ret = await collection.deleteOne({_id:new Types.ObjectId(postId),category:type});

      await this.modelMap["users"].updateOne({_id:post.writer_id},{$inc:{writer_count:-1}});

     return {post:ret,success:true,message:"삭제 성공"};
    }catch(error){
      return {success:false,message:error};
    }
  }

  async community_comment_delete(postId:string,type:string,commentId:string,userId:string){
    try{
      const user = await this.modelMap["users"].findById(userId);
      if(!user){
        return {success:false,message:"로그인 해주세요."};
      }
      var collection = await this.modelMap["community"];
      const post = await collection.findOne({_id:new Types.ObjectId(postId),category:type});
      if(!post){
        return {success:false,message:"게시글을 찾을 수 없습니다."};
      }
      var comments = post.comment;
      const target = comments.find(c => c.comment_id === commentId)
        ?? comments.flatMap(c => c.reply_list).find(r => r.comment_id === commentId);
      if(!target){
        return {success:false,message:"댓글을 찾을 수 없습니다."};
      }
      if(target.writer !== user.name && user.role !== 'admin'){
        return {success:false,message:"삭제 권한이 없습니다."};
      }
      comments = comments
  .filter(c => c.comment_id !== commentId) // 댓글 자체 삭제
  .map(comment => ({
    ...comment,
    reply_list: comment.reply_list.filter(r => r.comment_id !== commentId) // 대댓글 삭제
  }));

      const ret = await collection.updateOne({_id:new Types.ObjectId(postId),category:type},{comment:comments});

      return {post:ret,success:true,message:"삭제 성공"};
    }catch(error){
      return {success:false,message:error};
    }
  }

 

  async community_comment_write(postId:string,parent_id:string|null,name:string,writer:string,content:string){
    try{
      var collection = await this.modelMap["users"];
      const user = await collection.findById(writer);
      const writer_name = user.name;
       collection = await this.modelMap["community"];
      const post = await collection.findOne({_id:new Types.ObjectId(postId)});
      var comment_list = post.comment;
      if(parent_id==null){
        comment_list.push({comment_id:await this.new_id(),writer:writer_name,content:content,like_count:0,like_list:[],reply_list:[],createdAt:DateUtils.now_date()});
      }else{
        comment_list = comment_list.map( comment => {
          if(comment.comment_id==parent_id){
            comment.reply_list.push({comment_id: this.new_id(),writer:writer_name,content:content,like_count:0,like_list:[],createdAt:DateUtils.now_date()});
          }
          return comment;
        });
      }
      const ret = await collection.updateOne({_id:new Types.ObjectId(postId)},{$set:{comment:comment_list}});

      await this.xpService.addXp(writer, 1);

      return {success:true,message:"댓글 작성 완료",ret:ret};
    }catch(error){
      return {message:error};
    }
  }

  async community_comment_like(postId:string,commentId:string,userId:string){
    try{
      var collection = await this.modelMap["community"];
      const post = await collection.findOne({_id:new Types.ObjectId(postId)});
      var comment_list =  post.comment;

      comment_list = comment_list.map( comment => {
        if(comment.comment_id==commentId){
            if(comment.like_list.includes(userId)){
                comment.like_list = comment.like_list.filter(like => like !== userId);
                comment.like_count--;
            }else{
                comment.like_list.push(userId);
                comment.like_count++;
            }
        }


        comment.reply_list = comment.reply_list.map(reply_comment =>{
            if(reply_comment.comment_id==commentId){
              if(reply_comment.like_list.includes(userId)){
                reply_comment.like_list = reply_comment.like_list.filter(like => like !== userId);
                reply_comment.like_count--;
            }else{
              reply_comment.like_list.push(userId);
              reply_comment.like_count++;
            }
            }

            return reply_comment;
        });
        return comment;
      });

      comment_list = comment_list.map(comment => {
        if(comment.comment_id==commentId){
          comment.reply_list = comment.reply_list.map(reply => {
            if(reply.comment_id==commentId){
              reply.like_list = reply.like_list.filter(like => like !== userId);
              reply.like_count--;
            }else{
              reply.like_list.push(userId);
              reply.like_count++;   
            }
            return reply;
          });
        }
        return comment;
      });

      console.log(comment_list);
      const ret = await collection.updateOne({_id:new Types.ObjectId(postId)},{$set:{comment:comment_list}});
      return {success:true,message:"댓글 좋아요 완료",ret:ret};
    }catch(error){
      return {message:error};
    }
  }
}