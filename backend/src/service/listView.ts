import {BadRequestException, Injectable} from "@nestjs/common"
import { DateUtils } from "../utils/dateUtils";
import {Model, Types} from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";

function escapeRegex(text:string){
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

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
      community:this.community


    };

    }

    private async attachUploaderLevel(files: any[]) {
        const uploaderNames = [...new Set(files.map(f => f.uploader))];
        const levelMap: Record<string, number> = {};
        if (uploaderNames.length > 0) {
            const uploaders = await this.userModel.find({ name: { $in: uploaderNames } }).select('name level');
            uploaders.forEach((u: any) => { levelMap[u.name] = u.level ?? 1; });
        }
        return files.map(f => {
            const plain = f.toObject ? f.toObject() : f;
            return { ...plain, uploader_level: levelMap[f.uploader] ?? 1 };
        });
    }

    async gym_view(type:string,name:string,keyword?:string){
        try{

        if(!['image','video','audio','document','app'].includes(type)){
            return { files: [], id: [] }
        }
        var collection = await this.modelMap[type];
        const query:any = { download_type: 'gym', type };
        if(keyword && keyword.trim()){
            query.title = { $regex: escapeRegex(keyword.trim()), $options: 'i' };
        }
        const rawFiles = await collection?.find(query)

        if(!rawFiles){
            throw new BadRequestException("파일없음");
        }

        const id = rawFiles.map(f => new Types.ObjectId(f._id))
        const end_time = rawFiles.map(f => DateUtils.date_to_string(f.end_time));
        const start_price = rawFiles.map(f => f.start_price);
        const files = await this.attachUploaderLevel(rawFiles);


        return { files, id ,name:name, end_time:DateUtils.date_to_string( end_time), start_price:start_price};
    }catch(error){
        console.log(error)
        return { success: false, message: error }
    }
}

async free_view(type:string,name:string,keyword?:string){
try{
            if(!['image','video','audio','document','app'].includes(type)){
                return { files: [], id: [], writer_is_me: [] };
            }
            var collection = this.modelMap[type];
            const query:any = { download_type: 'free', type };
            if(keyword && keyword.trim()){
                query.title = { $regex: escapeRegex(keyword.trim()), $options: 'i' };
            }
            const rawFiles = await collection?.find(query)

            if(!rawFiles){
                throw new BadRequestException("파일없음");
            }

            const id = rawFiles.map(f =>new Types.ObjectId(f._id))
            const writer_is_me = rawFiles.map(f => name !== '로그인 해주세요.' && f.uploader === name)
            const files = await this.attachUploaderLevel(rawFiles);

            return { files:files, id:id ,name:name, writer_is_me:writer_is_me}
        }catch(error){
            console.log(error)
            return { success: false, message: error };
        }
}


async paid_view(type: string, name: string, keyword?: string) {
    try {
      if (!['image', 'video', 'audio', 'document', 'app'].includes(type)) {
        return { files: [], id: [], name, writer_is_me: [] };
      }

      const collection = this.modelMap[type];
      const query:any = { download_type: 'paid', type };
      if(keyword && keyword.trim()){
          query.title = { $regex: escapeRegex(keyword.trim()), $options: 'i' };
      }

      const rawFiles = await collection
        .find(query)
        .exec();

      const id = rawFiles.map((f) => f._id.toString());
      const writer_is_me = rawFiles.map((f) => name !== '로그인 해주세요.' && f.uploader === name);
      const files = await this.attachUploaderLevel(rawFiles);

      return { files, id, name, writer_is_me };
    } catch (error) {
      console.log(error);
      return { success: false, message: error.message };
    }
  }



  async community_list_view(type:string,name:string,keyword?:string,sort?:string){
     try{
        var collection = await this.modelMap["community"];

        const query:any = {category:type};
        if(keyword && keyword.trim()){
            const escaped = escapeRegex(keyword.trim());
            query.$or = [
                {title: {$regex: escaped, $options: 'i'}},
                {content: {$regex: escaped, $options: 'i'}},
            ];
        }

        const sortMap:Record<string, any> = {
            latest: {createdAt: -1},
            likes: {like_count: -1, createdAt: -1},
            comments: {comment_count: -1, createdAt: -1},
            views: {view_count: -1, createdAt: -1},
        };
        const sortOption = sortMap[sort ?? 'latest'] ?? sortMap.latest;

        const list = await collection.find(query).sort(sortOption).exec();

        return {list:list,name:name,message:"불러오기 성공"};

     }catch(error){
 return {message:error,name:name};
     }
  }

  async featured_post(){
    try{
        const collection = this.modelMap["community"];

        const notice = await collection.findOne({category:'notice'}).sort({createdAt:-1});
        if(notice){
            return { post: notice, kind: 'notice' };
        }

        const popular = await collection.aggregate([
            { $addFields: { score: { $add: [ { $ifNull: ['$like_count', 0] }, { $ifNull: ['$comment_count', 0] } ] } } },
            { $sort: { score: -1, createdAt: -1 } },
            { $limit: 1 },
        ]);

        return { post: popular[0] ?? null, kind: popular[0] ? 'popular' : null };
    }catch(error){
        console.log(error);
        return { post: null, kind: null };
    }
  }


}



