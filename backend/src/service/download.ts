import { Injectable, NotFoundException } from '@nestjs/common';
import * as path from 'path';

import {Model, Types} from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import * as fs from "fs";
import sharp from "sharp";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";

if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
}




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

 @InjectModel('purchases')
 private readonly purchaseModel: Model<any>,

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




private async checkAccess(doc: any, userId?: string) {
  if (doc.download_type !== 'paid') {
    return true;
  }
  if (!userId) {
    return false;
  }

  const user = await this.userModel.findById(userId);
  if (!user) {
    return false;
  }
  if (doc.uploader === user.name) {
    return true;
  }

  const purchase = await this.purchaseModel.findOne({ user_id: user._id, file_id: doc._id });
  return !!purchase;
}

async serve_file(type: string, id: string, userId?: string) {
  try {
    if (!this.modelMap[type]) {
      return { success: false, message: "invalid type" };
    }
    if (!Types.ObjectId.isValid(id)) {
      return { success: false, message: "invalid id" };
    }

    const collection = this.modelMap[type];
    const doc = await collection.findOne({ _id: new Types.ObjectId(id) });
    if (!doc) {
      return { success: false, message: "not found" };
    }

    const allowed = await this.checkAccess(doc, userId);
    if (!allowed) {
      return { success: false, message: "구매 후 이용 가능합니다.", status: 403 };
    }

    const abs = path.join(process.cwd(), "files", type, path.basename(doc.path));
    if (!fs.existsSync(abs)) {
      return { success: false, message: "file not found" };
    }

    return { success: true, path: abs };
  } catch (e) {
    console.log(e);
    return { success: false, message: "serve failed" };
  }
}

private extractVideoFrame(abs: string, time: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    ffmpeg(abs)
      .seekInput(time)
      .frames(1)
      .format("image2")
      .outputOptions("-vcodec", "mjpeg")
      .on("error", reject)
      .pipe()
      .on("data", (chunk: Buffer) => chunks.push(chunk))
      .on("end", () => resolve(Buffer.concat(chunks)));
  });
}

async serve_preview(type: string, id: string) {
  try {
    if (type !== "image" && type !== "video") {
      return { success: false, message: "preview not supported", status: 404 };
    }
    if (!Types.ObjectId.isValid(id)) {
      return { success: false, message: "invalid id" };
    }

    const collection = this.modelMap[type];
    const doc = await collection.findOne({ _id: new Types.ObjectId(id) });
    if (!doc) {
      return { success: false, message: "not found" };
    }

    const abs = path.join(process.cwd(), "files", type, path.basename(doc.path));
    if (!fs.existsSync(abs)) {
      return { success: false, message: "file not found" };
    }

    let source: string | Buffer = abs;
    if (type === "video") {
      try {
        source = await this.extractVideoFrame(abs, "00:00:01");
      } catch {
        source = await this.extractVideoFrame(abs, "00:00:00");
      }
    }

    const buffer = await sharp(source)
      .resize({ width: 32 })
      .blur(12)
      .jpeg({ quality: 40 })
      .toBuffer();

    return { success: true, buffer };
  } catch (e) {
    console.log(e);
    return { success: false, message: "preview failed" };
  }
}

async download_file(type: string, id: string, userId?: string) {
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

    const allowed = await this.checkAccess(doc, userId);
    if (!allowed) {
      return { success: false, message: "구매 후 이용 가능합니다.", status: 403 };
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