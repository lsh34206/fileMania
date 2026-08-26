import { Schema } from 'mongoose';
export declare const usersSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    id: string;
    name: string;
    role: string;
    bio: string;
    email: string;
    password: string;
    status: "banned" | "suspended" | "active";
    suspend_reason: string;
    xp: number;
    level: number;
    createdAt: NativeDate;
    writer_count: number;
    phone: string;
    isActive: number;
    ban_reason: string;
    point: number;
    massege_list: any[];
    liked_file_list: any[];
    suspended_until?: NativeDate | null | undefined;
}, import("mongoose").Document<unknown, {}, {
    id: string;
    name: string;
    role: string;
    bio: string;
    email: string;
    password: string;
    status: "banned" | "suspended" | "active";
    suspend_reason: string;
    xp: number;
    level: number;
    createdAt: NativeDate;
    writer_count: number;
    phone: string;
    isActive: number;
    ban_reason: string;
    point: number;
    massege_list: any[];
    liked_file_list: any[];
    suspended_until?: NativeDate | null | undefined;
}, {}, import("mongoose").DefaultSchemaOptions> & {
    id: string;
    name: string;
    role: string;
    bio: string;
    email: string;
    password: string;
    status: "banned" | "suspended" | "active";
    suspend_reason: string;
    xp: number;
    level: number;
    createdAt: NativeDate;
    writer_count: number;
    phone: string;
    isActive: number;
    ban_reason: string;
    point: number;
    massege_list: any[];
    liked_file_list: any[];
    suspended_until?: NativeDate | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, unknown, {
    id: string;
    name: string;
    role: string;
    bio: string;
    email: string;
    password: string;
    status: "banned" | "suspended" | "active";
    suspend_reason: string;
    xp: number;
    level: number;
    createdAt: NativeDate;
    writer_count: number;
    phone: string;
    isActive: number;
    ban_reason: string;
    point: number;
    massege_list: any[];
    liked_file_list: any[];
    suspended_until?: NativeDate | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export declare const purchaseSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    price: number;
    file_id: import("mongoose").Types.ObjectId;
    file_type: string;
    createdAt: NativeDate;
    user_id: import("mongoose").Types.ObjectId;
}, import("mongoose").Document<unknown, {}, {
    price: number;
    file_id: import("mongoose").Types.ObjectId;
    file_type: string;
    createdAt: NativeDate;
    user_id: import("mongoose").Types.ObjectId;
}, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<{
    price: number;
    file_id: import("mongoose").Types.ObjectId;
    file_type: string;
    createdAt: NativeDate;
    user_id: import("mongoose").Types.ObjectId;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    price: number;
    file_id: import("mongoose").Types.ObjectId;
    file_type: string;
    createdAt: NativeDate;
    user_id: import("mongoose").Types.ObjectId;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export declare const pointChargeSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    status: "paid" | "ready" | "failed";
    createdAt: NativeDate;
    user_id: import("mongoose").Types.ObjectId;
    order_id: string;
    amount: number;
    payment_key: string;
    method: string;
    approved_at?: NativeDate | null | undefined;
}, import("mongoose").Document<unknown, {}, {
    status: "paid" | "ready" | "failed";
    createdAt: NativeDate;
    user_id: import("mongoose").Types.ObjectId;
    order_id: string;
    amount: number;
    payment_key: string;
    method: string;
    approved_at?: NativeDate | null | undefined;
}, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<{
    status: "paid" | "ready" | "failed";
    createdAt: NativeDate;
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
    status: "paid" | "ready" | "failed";
    createdAt: NativeDate;
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
    last_message: string;
    last_message_time: NativeDate;
    participants: import("mongoose").Types.ObjectId[];
}, import("mongoose").Document<unknown, {}, {
    type: string;
    createdAt: NativeDate;
    auction_id: import("mongoose").Types.ObjectId;
    last_message: string;
    last_message_time: NativeDate;
    participants: import("mongoose").Types.ObjectId[];
}, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<{
    type: string;
    createdAt: NativeDate;
    auction_id: import("mongoose").Types.ObjectId;
    last_message: string;
    last_message_time: NativeDate;
    participants: import("mongoose").Types.ObjectId[];
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
    last_message: string;
    last_message_time: NativeDate;
    participants: import("mongoose").Types.ObjectId[];
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export declare const messageSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    content: string;
    createdAt: NativeDate;
    sender_id: import("mongoose").Types.ObjectId;
    room_id: import("mongoose").Types.ObjectId;
    isRead: boolean;
}, import("mongoose").Document<unknown, {}, {
    content: string;
    createdAt: NativeDate;
    sender_id: import("mongoose").Types.ObjectId;
    room_id: import("mongoose").Types.ObjectId;
    isRead: boolean;
}, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<{
    content: string;
    createdAt: NativeDate;
    sender_id: import("mongoose").Types.ObjectId;
    room_id: import("mongoose").Types.ObjectId;
    isRead: boolean;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    content: string;
    createdAt: NativeDate;
    sender_id: import("mongoose").Types.ObjectId;
    room_id: import("mongoose").Types.ObjectId;
    isRead: boolean;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export declare const filesSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    type: string;
    download_type: string;
    download_count: number;
    path: string;
    title: string;
    description: string;
    price: number;
    size: string;
    uploader: string;
    start_price: number;
    createdAt: NativeDate;
    end_time?: NativeDate | null | undefined;
}, import("mongoose").Document<unknown, {}, {
    type: string;
    download_type: string;
    download_count: number;
    path: string;
    title: string;
    description: string;
    price: number;
    size: string;
    uploader: string;
    start_price: number;
    createdAt: NativeDate;
    end_time?: NativeDate | null | undefined;
}, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<{
    type: string;
    download_type: string;
    download_count: number;
    path: string;
    title: string;
    description: string;
    price: number;
    size: string;
    uploader: string;
    start_price: number;
    createdAt: NativeDate;
    end_time?: NativeDate | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    type: string;
    download_type: string;
    download_count: number;
    path: string;
    title: string;
    description: string;
    price: number;
    size: string;
    uploader: string;
    start_price: number;
    createdAt: NativeDate;
    end_time?: NativeDate | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export declare const gymsSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    status: "active" | "paid" | "failed" | "ended" | "cancelled";
    title: string;
    description: string;
    start_price: number;
    end_time: NativeDate;
    file_id: import("mongoose").Types.ObjectId;
    file_type: string;
    seller_id: import("mongoose").Types.ObjectId;
    seller_name: string;
    createdAt: NativeDate;
    current_price: number;
    highest_bidder_price: number;
    highest_bidder_name: string;
    bid_count: number;
    min_bid_unit: number;
    start_time: NativeDate;
    highest_bidder_id?: import("mongoose").Types.ObjectId | null | undefined;
}, import("mongoose").Document<unknown, {}, {
    status: "active" | "paid" | "failed" | "ended" | "cancelled";
    title: string;
    description: string;
    start_price: number;
    end_time: NativeDate;
    file_id: import("mongoose").Types.ObjectId;
    file_type: string;
    seller_id: import("mongoose").Types.ObjectId;
    seller_name: string;
    createdAt: NativeDate;
    current_price: number;
    highest_bidder_price: number;
    highest_bidder_name: string;
    bid_count: number;
    min_bid_unit: number;
    start_time: NativeDate;
    highest_bidder_id?: import("mongoose").Types.ObjectId | null | undefined;
}, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<{
    status: "active" | "paid" | "failed" | "ended" | "cancelled";
    title: string;
    description: string;
    start_price: number;
    end_time: NativeDate;
    file_id: import("mongoose").Types.ObjectId;
    file_type: string;
    seller_id: import("mongoose").Types.ObjectId;
    seller_name: string;
    createdAt: NativeDate;
    current_price: number;
    highest_bidder_price: number;
    highest_bidder_name: string;
    bid_count: number;
    min_bid_unit: number;
    start_time: NativeDate;
    highest_bidder_id?: import("mongoose").Types.ObjectId | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    status: "active" | "paid" | "failed" | "ended" | "cancelled";
    title: string;
    description: string;
    start_price: number;
    end_time: NativeDate;
    file_id: import("mongoose").Types.ObjectId;
    file_type: string;
    seller_id: import("mongoose").Types.ObjectId;
    seller_name: string;
    createdAt: NativeDate;
    current_price: number;
    highest_bidder_price: number;
    highest_bidder_name: string;
    bid_count: number;
    min_bid_unit: number;
    start_time: NativeDate;
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
    seller_id: import("mongoose").Types.ObjectId;
    auction_id: import("mongoose").Types.ObjectId;
    winner_name: string;
    final_price: number;
    is_paid: boolean;
    is_downloadable: boolean;
    endedAt: NativeDate;
    winner_id?: import("mongoose").Types.ObjectId | null | undefined;
}, import("mongoose").Document<unknown, {}, {
    file_id: import("mongoose").Types.ObjectId;
    file_type: string;
    seller_id: import("mongoose").Types.ObjectId;
    auction_id: import("mongoose").Types.ObjectId;
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
    seller_id: import("mongoose").Types.ObjectId;
    auction_id: import("mongoose").Types.ObjectId;
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
    seller_id: import("mongoose").Types.ObjectId;
    auction_id: import("mongoose").Types.ObjectId;
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
    title: string;
    content: string;
    category: "notice" | "talk" | "share" | "question";
    createdAt: NativeDate;
    view_count: number;
    writer: string;
    writer_id: import("mongoose").Types.ObjectId;
    comment: any[];
    like_count: number;
    like_list: any[];
    comment_count: number;
    is_deleted: boolean;
}, import("mongoose").Document<unknown, {}, {
    title: string;
    content: string;
    category: "notice" | "talk" | "share" | "question";
    createdAt: NativeDate;
    view_count: number;
    writer: string;
    writer_id: import("mongoose").Types.ObjectId;
    comment: any[];
    like_count: number;
    like_list: any[];
    comment_count: number;
    is_deleted: boolean;
}, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<{
    title: string;
    content: string;
    category: "notice" | "talk" | "share" | "question";
    createdAt: NativeDate;
    view_count: number;
    writer: string;
    writer_id: import("mongoose").Types.ObjectId;
    comment: any[];
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
    title: string;
    content: string;
    category: "notice" | "talk" | "share" | "question";
    createdAt: NativeDate;
    view_count: number;
    writer: string;
    writer_id: import("mongoose").Types.ObjectId;
    comment: any[];
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
    auction_id: import("mongoose").Types.ObjectId;
    sender_id: import("mongoose").Types.ObjectId;
    sender_name: string;
    message: string;
    message_type: "chat" | "bid" | "system";
    room_id: string;
    is_deleted: boolean;
    bid_price?: number | null | undefined;
}, import("mongoose").Document<unknown, {}, {
    createdAt: NativeDate;
    auction_id: import("mongoose").Types.ObjectId;
    sender_id: import("mongoose").Types.ObjectId;
    sender_name: string;
    message: string;
    message_type: "chat" | "bid" | "system";
    room_id: string;
    is_deleted: boolean;
    bid_price?: number | null | undefined;
}, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<{
    createdAt: NativeDate;
    auction_id: import("mongoose").Types.ObjectId;
    sender_id: import("mongoose").Types.ObjectId;
    sender_name: string;
    message: string;
    message_type: "chat" | "bid" | "system";
    room_id: string;
    is_deleted: boolean;
    bid_price?: number | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    createdAt: NativeDate;
    auction_id: import("mongoose").Types.ObjectId;
    sender_id: import("mongoose").Types.ObjectId;
    sender_name: string;
    message: string;
    message_type: "chat" | "bid" | "system";
    room_id: string;
    is_deleted: boolean;
    bid_price?: number | null | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
