import { Injectable, Next, Req,Res } from "@nestjs/common";
import {Model, Types} from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { DateUtils } from "../utils/dateUtils";

import * as bcrypt from "bcrypt"
import { resolve } from "path";
import { rejects } from "assert";
import { ObjectId } from "mongodb";


type singup_data_type = {
    name:string,
      id:string,
      email:string,
      password:string,
     password_check:string
};
type login_data_type = {
      id:string,
      password:string,
};

@Injectable()
export class authService{
   constructor(

    @InjectModel("users")
    private readonly userModel:Model<any>
   ){}

   

    async login_Load(userid: string){
        const name = await this.userModel.findById(userid).select("name");
        return name?.name ?? null;
    }

    async role_Load(userid: string){
        const user = await this.userModel.findById(userid).select("role");
        return user?.role ?? null;
    }

    async mypage_Load(userid: string){
        const user = await this.userModel.findById(userid);
        return user ?? null;
    }

    async updateBio(userid: string, bio: string){
        const user = await this.userModel.findByIdAndUpdate(userid, { bio: bio }, { new: true });
        return user ?? null;
    }

    async profile_Load(name: string){
        const user = await this.userModel
            .findOne({ name })
            .select("name bio level xp createdAt writer_count");
        return user ?? null;
    }


    

    async singup_ok(data:singup_data_type){
        try{
            const collection = this.userModel;

            const search_id = await collection?.findOne({id: data.id});
            console.log(search_id);
            if(search_id) {
                       return {success: false, message: '이미 존재하는 아이디입니다.'};
                }
    
                const search_name = await collection?.findOne({name: data.name});
                if(search_name) {
                    return {success: false, message: '이미 존재하는 이름입니다.'};
            }
    
            if(!search_id && !search_name){

            const hashed_password = bcrypt.hashSync(data.password, 10);

            const result = await collection?.insertOne({name: data.name, id: data.id, email: data.email, password: hashed_password});
            
            return {success: true, message: '회원가입 완료'};
            }else{
                return {success: true, message: '회원가입 완료'};
            }
        }catch(error){
            console.log(error);
            return {success: false, message: "회원가입 실패"};
        }
    }

    async pw_Check(data:login_data_type){

        const send_json = {suc:{success: true, message: '로그인 완료'},failed:{success: false, message: '비밀번호가 일치하지 않습니다.'}};

        try{
            const collection = this.userModel;


            const search_user = await collection?.findOne({id: data.id});
         if(!search_user){
            return {is_password:false,res:send_json.failed};
         }
         const is_password = bcrypt.compareSync(data.password,search_user.password);
        if(!is_password){
            return {is_password:false,res:send_json.failed};
        }

        if(search_user.status === 'banned'){
            return {is_password:false,res:{success:false,message:`차단된 계정입니다.${search_user.ban_reason ? ` (사유: ${search_user.ban_reason})` : ''}`}};
        }

        if(search_user.status === 'suspended'){
            if(search_user.suspended_until && new Date(search_user.suspended_until) > new Date()){
                const until = new Date(search_user.suspended_until).toLocaleString('ko-KR');
                return {is_password:false,res:{success:false,message:`정지된 계정입니다. (${until}까지)${search_user.suspend_reason ? ` 사유: ${search_user.suspend_reason}` : ''}`}};
            }
            await collection.updateOne({_id:search_user._id},{$set:{status:'active',suspended_until:null,suspend_reason:''}});
        }

        const user = search_user._id.toString();

        return {is_password:is_password,user:user,res:send_json.suc};

    }catch(err){
        return {is_password:false,res:send_json.failed};
    }


}



}


   
    



    
