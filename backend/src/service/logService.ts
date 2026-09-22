import { Injectable } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

export const LOG_TYPES = [
  'login',
  'auction',
  'post_write',
  'file_upload',
  'comment_write',
  'post_view',
  'file_download',
  'charge',
] as const;

export type LogType = typeof LOG_TYPES[number];

@Injectable()
export class logService {
    constructor(
        @InjectModel('systemLogs')
        private readonly logModel: Model<any>,
    ) {}

    async write(type: LogType, message: string, userId?: string | null, userName?: string, meta: Record<string, any> = {}) {
        try {
            await this.logModel.insertOne({
                type,
                message,
                user_id: userId && Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : null,
                user_name: userName ?? '',
                meta,
            });
        } catch (error) {
            console.log('system log write failed', error);
        }
    }

    async list(type?: string, keyword?: string, limit = 300) {
        const query: any = {};
        if (type && type !== 'all' && (LOG_TYPES as readonly string[]).includes(type)) {
            query.type = type;
        }
        if (keyword && keyword.trim()) {
            const escaped = keyword.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escaped, 'i');
            query.$or = [{ message: regex }, { user_name: regex }];
        }

        return await this.logModel.find(query).sort({ createdAt: -1 }).limit(limit);
    }
}
