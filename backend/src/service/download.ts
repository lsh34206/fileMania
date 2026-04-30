import { Injectable, NotFoundException } from '@nestjs/common';
import * as path from 'path';

import {Model, Types} from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import * as fs from "fs";




@Injectable()
export class downloadService{
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



async download_file(type: string, id: string) {
  try {
    console.log("type:", type);
    console.log("id:", id);

    if (!this.modelMap[type]) {
      return { success: false, message: "invalid type" };
    }

    if (!Types.ObjectId.isValid(id)) {
      return { success: false, message: "invalid id" };
    }

    const collection = this.modelMap[type];

    const doc = await collection.findOne({
      _id: new Types.ObjectId(id),
    });

    if (!doc) {
      return { success: false, message: "not found" };
    }

    const originalBase = path.basename(doc.path);
    const ext = path.extname(originalBase) || "";
    const safeTitle = (doc.title || path.basename(originalBase, ext))
      .replace(/[\\/:*?"<>|]/g, "_");

    const downloadName = `${safeTitle}${ext}`;
    const abs = path.join(process.cwd(), "files", type, originalBase);

    console.log("abs:", abs);

    if (!fs.existsSync(abs)) {
      return { success: false, message: "file not found" };
    }

    await collection.updateOne(
      { _id: doc._id },
      { $inc: { download_count: 1 } }
    );

    return {
      success: true,
      message: "download success",
      path: abs,
      name: downloadName,
    };
  } catch (e) {
    console.log(e);
    return { success: false, message: "download failed" };
  }
}



    


}