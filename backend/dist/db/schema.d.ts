import { Schema } from 'mongoose';
export declare const usersSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    id: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    bio: string;
    createdAt: NativeDate;
    isActive: number;
    role: string;
    status: "active" | "suspended" | "banned";
    suspend_reason: string;
    ban_reason: string;
    point: number;
    xp: number;
    level: number;
    massege_list: any[];
    writer_count: number;
    liked_file_list: any[];
    suspended_until?: NativeDate | null | undefined;
}, import("mongoose").Document<unknown, {}, {
    id: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    bio: string;
    createdAt: NativeDate;
    isActive: number;
    role: string;
    status: "active" | "suspended" | "banned";
    suspend_reason: string;
    ban_reason: string;
    point: number;
    xp: number;
    level: number;
    massege_list: any[];
    writer_count: number;
    liked_file_list: any[];
    suspended_until?: NativeDate | null | undefined;
}, {}, import("mongoose").DefaultSchemaOptions> & {
    id: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    bio: string;
    createdAt: NativeDate;
    isActive: number;
    role: string;
    status: "active" | "suspended" | "banned";
    suspend_reason: string;
    ban_reason: string;
    point: number;
    xp: number;
    level: number;
    massege_list: any[];
    writer_count: number;
    liked_file_list: any[];
    suspended_until?: NativeDate | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, unknown, {
    id: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    bio: string;
    createdAt: NativeDate;
    isActive: number;
    role: string;
    status: "active" | "suspended" | "banned";
    suspend_reason: string;
    ban_reason: string;
    point: number;
    xp: number;
    level: number;
    massege_list: any[];
    writer_count: number;
    liked_file_list: any[];
    suspended_until?: NativeDate | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export declare const purchaseSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    createdAt: NativeDate;
    user_id: import("mongoose").Types.ObjectId;
    file_id: import("mongoose").Types.ObjectId;
    file_type: string;
    price: number;
}, import("mongoose").Document<unknown, {}, {
    createdAt: NativeDate;
    user_id: import("mongoose").Types.ObjectId;
    file_id: import("mongoose").Types.ObjectId;
    file_type: string;
    price: number;
}, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<{
    createdAt: NativeDate;
    user_id: import("mongoose").Types.ObjectId;
    file_id: import("mongoose").Types.ObjectId;
    file_type: string;
    price: number;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    createdAt: NativeDate;
    user_id: import("mongoose").Types.ObjectId;
    file_id: import("mongoose").Types.ObjectId;
    file_type: string;
    price: number;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export declare const pointChargeSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    createdAt: NativeDate;
    status: "ready" | "paid" | "failed";
    user_id: import("mongoose").Types.ObjectId;
    order_id: string;
    amount: number;
    payment_key: string;
    method: string;
    approved_at?: NativeDate | null | undefined;
}, import("mongoose").Document<unknown, {}, {
    createdAt: NativeDate;
    status: "ready" | "paid" | "failed";
    user_id: import("mongoose").Types.ObjectId;
    order_id: string;
    amount: number;
    payment_key: string;
    method: string;
    approved_at?: NativeDate | null | undefined;
}, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<{
    createdAt: NativeDate;
    status: "ready" | "paid" | "failed";
    user_id: import("mongoose").Types.ObjectId;
    order_id: string;
    amount: number;
    payment_key: string;
    method: string;
    approved_at?: NativeDate | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    createdAt: NativeDate;
    status: "ready" | "paid" | "failed";
    user_id: import("mongoose").Types.ObjectId;
    order_id: string;
    amount: number;
    payment_key: string;
    method: string;
    approved_at?: NativeDate | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export declare const chatroomSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    type: string;
    createdAt: NativeDate;
    auction_id: import("mongoose").Types.ObjectId;
    participants: import("mongoose").Types.ObjectId[];
    last_message: string;
    last_message_time: NativeDate;
}, import("mongoose").Document<unknown, {}, {
    type: string;
    createdAt: NativeDate;
    auction_id: import("mongoose").Types.ObjectId;
    participants: import("mongoose").Types.ObjectId[];
    last_message: string;
    last_message_time: NativeDate;
}, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<{
    type: string;
    createdAt: NativeDate;
    auction_id: import("mongoose").Types.ObjectId;
    participants: import("mongoose").Types.ObjectId[];
    last_message: string;
    last_message_time: NativeDate;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    type: string;
    createdAt: NativeDate;
    auction_id: import("mongoose").Types.ObjectId;
    participants: import("mongoose").Types.ObjectId[];
    last_message: string;
    last_message_time: NativeDate;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export declare const messageSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    createdAt: NativeDate;
    room_id: import("mongoose").Types.ObjectId;
    sender_id: import("mongoose").Types.ObjectId;
    content: string;
    isRead: boolean;
}, import("mongoose").Document<unknown, {}, {
    createdAt: NativeDate;
    room_id: import("mongoose").Types.ObjectId;
    sender_id: import("mongoose").Types.ObjectId;
    content: string;
    isRead: boolean;
}, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<{
    createdAt: NativeDate;
    room_id: import("mongoose").Types.ObjectId;
    sender_id: import("mongoose").Types.ObjectId;
    content: string;
    isRead: boolean;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    createdAt: NativeDate;
    room_id: import("mongoose").Types.ObjectId;
    sender_id: import("mongoose").Types.ObjectId;
    content: string;
    isRead: boolean;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export declare const filesSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    type: string;
    createdAt: NativeDate;
    price: number;
    size: string;
    description: string;
    title: string;
    uploader: string;
    path: string;
    download_type: string;
    download_count: number;
    start_price: number;
    end_time?: NativeDate | null | undefined;
}, import("mongoose").Document<unknown, {}, {
    type: string;
    createdAt: NativeDate;
    price: number;
    size: string;
    description: string;
    title: string;
    uploader: string;
    path: string;
    download_type: string;
    download_count: number;
    start_price: number;
    end_time?: NativeDate | null | undefined;
}, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<{
    type: string;
    createdAt: NativeDate;
    price: number;
    size: string;
    description: string;
    title: string;
    uploader: string;
    path: string;
    download_type: string;
    download_count: number;
    start_price: number;
    end_time?: NativeDate | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    type: string;
    createdAt: NativeDate;
    price: number;
    size: string;
    description: string;
    title: string;
    uploader: string;
    path: string;
    download_type: string;
    download_count: number;
    start_price: number;
    end_time?: NativeDate | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export declare const gymsSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    createdAt: NativeDate;
    status: "active" | "paid" | "failed" | "ended" | "cancelled";
    file_id: import("mongoose").Types.ObjectId;
    file_type: string;
    description: string;
    title: string;
    start_price: number;
    end_time: NativeDate;
    seller_id: import("mongoose").Types.ObjectId;
    seller_name: string;
    current_price: number;
    min_bid_unit: number;
    highest_bidder_name: string;
    highest_bidder_price: number;
    start_time: NativeDate;
    bid_count: number;
    highest_bidder_id?: import("mongoose").Types.ObjectId | null | undefined;
}, import("mongoose").Document<unknown, {}, {
    createdAt: NativeDate;
    status: "active" | "paid" | "failed" | "ended" | "cancelled";
    file_id: import("mongoose").Types.ObjectId;
    file_type: string;
    description: string;
    title: string;
    start_price: number;
    end_time: NativeDate;
    seller_id: import("mongoose").Types.ObjectId;
    seller_name: string;
    current_price: number;
    min_bid_unit: number;
    highest_bidder_name: string;
    highest_bidder_price: number;
    start_time: NativeDate;
    bid_count: number;
    highest_bidder_id?: import("mongoose").Types.ObjectId | null | undefined;
}, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<{
    createdAt: NativeDate;
    status: "active" | "paid" | "failed" | "ended" | "cancelled";
    file_id: import("mongoose").Types.ObjectId;
    file_type: string;
    description: string;
    title: string;
    start_price: number;
    end_time: NativeDate;
    seller_id: import("mongoose").Types.ObjectId;
    seller_name: string;
    current_price: number;
    min_bid_unit: number;
    highest_bidder_name: string;
    highest_bidder_price: number;
    start_time: NativeDate;
    bid_count: number;
    highest_bidder_id?: import("mongoose").Types.ObjectId | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    createdAt: NativeDate;
    status: "active" | "paid" | "failed" | "ended" | "cancelled";
    file_id: import("mongoose").Types.ObjectId;
    file_type: string;
    description: string;
    title: string;
    start_price: number;
    end_time: NativeDate;
    seller_id: import("mongoose").Types.ObjectId;
    seller_name: string;
    current_price: number;
    min_bid_unit: number;
    highest_bidder_name: string;
    highest_bidder_price: number;
    start_time: NativeDate;
    bid_count: number;
    highest_bidder_id?: import("mongoose").Types.ObjectId | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export declare const gymBidsSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    createdAt: NativeDate;
    auction_id: import("mongoose").Types.ObjectId;
    bidder_id: import("mongoose").Types.ObjectId;
    bidder_name: string;
    bid_price: number;
}, import("mongoose").Document<unknown, {}, {
    createdAt: NativeDate;
    auction_id: import("mongoose").Types.ObjectId;
    bidder_id: import("mongoose").Types.ObjectId;
    bidder_name: string;
    bid_price: number;
}, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<{
    createdAt: NativeDate;
    auction_id: import("mongoose").Types.ObjectId;
    bidder_id: import("mongoose").Types.ObjectId;
    bidder_name: string;
    bid_price: number;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    createdAt: NativeDate;
    auction_id: import("mongoose").Types.ObjectId;
    bidder_id: import("mongoose").Types.ObjectId;
    bidder_name: string;
    bid_price: number;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export declare const gymResultsSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    file_id: import("mongoose").Types.ObjectId;
    file_type: string;
    auction_id: import("mongoose").Types.ObjectId;
    seller_id: import("mongoose").Types.ObjectId;
    winner_name: string;
    final_price: number;
    is_paid: boolean;
    is_downloadable: boolean;
    endedAt: NativeDate;
    winner_id?: import("mongoose").Types.ObjectId | null | undefined;
}, import("mongoose").Document<unknown, {}, {
    file_id: import("mongoose").Types.ObjectId;
    file_type: string;
    auction_id: import("mongoose").Types.ObjectId;
    seller_id: import("mongoose").Types.ObjectId;
    winner_name: string;
    final_price: number;
    is_paid: boolean;
    is_downloadable: boolean;
    endedAt: NativeDate;
    winner_id?: import("mongoose").Types.ObjectId | null | undefined;
}, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<{
    file_id: import("mongoose").Types.ObjectId;
    file_type: string;
    auction_id: import("mongoose").Types.ObjectId;
    seller_id: import("mongoose").Types.ObjectId;
    winner_name: string;
    final_price: number;
    is_paid: boolean;
    is_downloadable: boolean;
    endedAt: NativeDate;
    winner_id?: import("mongoose").Types.ObjectId | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    file_id: import("mongoose").Types.ObjectId;
    file_type: string;
    auction_id: import("mongoose").Types.ObjectId;
    seller_id: import("mongoose").Types.ObjectId;
    winner_name: string;
    final_price: number;
    is_paid: boolean;
    is_downloadable: boolean;
    endedAt: NativeDate;
    winner_id?: import("mongoose").Types.ObjectId | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export declare const communitySchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    comment: any[];
    createdAt: NativeDate;
    content: string;
    title: string;
    category: "talk" | "share" | "question" | "notice";
    writer_id: import("mongoose").Types.ObjectId;
    writer: string;
    view_count: number;
    like_count: number;
    like_list: any[];
    comment_count: number;
    is_deleted: boolean;
}, import("mongoose").Document<unknown, {}, {
    comment: any[];
    createdAt: NativeDate;
    content: string;
    title: string;
    category: "talk" | "share" | "question" | "notice";
    writer_id: import("mongoose").Types.ObjectId;
    writer: string;
    view_count: number;
    like_count: number;
    like_list: any[];
    comment_count: number;
    is_deleted: boolean;
}, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<{
    comment: any[];
    createdAt: NativeDate;
    content: string;
    title: string;
    category: "talk" | "share" | "question" | "notice";
    writer_id: import("mongoose").Types.ObjectId;
    writer: string;
    view_count: number;
    like_count: number;
    like_list: any[];
    comment_count: number;
    is_deleted: boolean;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    comment: any[];
    createdAt: NativeDate;
    content: string;
    title: string;
    category: "talk" | "share" | "question" | "notice";
    writer_id: import("mongoose").Types.ObjectId;
    writer: string;
    view_count: number;
    like_count: number;
    like_list: any[];
    comment_count: number;
    is_deleted: boolean;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export declare const gymChatsSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    createdAt: NativeDate;
    message: string;
    auction_id: import("mongoose").Types.ObjectId;
    room_id: string;
    sender_id: import("mongoose").Types.ObjectId;
    is_deleted: boolean;
    sender_name: string;
    message_type: "chat" | "system" | "bid";
    bid_price?: number | null | undefined;
}, import("mongoose").Document<unknown, {}, {
    createdAt: NativeDate;
    message: string;
    auction_id: import("mongoose").Types.ObjectId;
    room_id: string;
    sender_id: import("mongoose").Types.ObjectId;
    is_deleted: boolean;
    sender_name: string;
    message_type: "chat" | "system" | "bid";
    bid_price?: number | null | undefined;
}, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<{
    createdAt: NativeDate;
    message: string;
    auction_id: import("mongoose").Types.ObjectId;
    room_id: string;
    sender_id: import("mongoose").Types.ObjectId;
    is_deleted: boolean;
    sender_name: string;
    message_type: "chat" | "system" | "bid";
    bid_price?: number | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    createdAt: NativeDate;
    message: string;
    auction_id: import("mongoose").Types.ObjectId;
    room_id: string;
    sender_id: import("mongoose").Types.ObjectId;
    is_deleted: boolean;
    sender_name: string;
    message_type: "chat" | "system" | "bid";
    bid_price?: number | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
