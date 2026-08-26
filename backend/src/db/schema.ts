import { Schema } from 'mongoose';

export const usersSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    phone: {type: String, default: ''},
    id: {type: String, required: true},
    bio: {type: String, default: ''},
    createdAt: { type: Date, default: Date.now },
    isActive: { type: Number, default: 1 },
   role: { type: String, default: 'user' },
    status: { type: String, default: 'active', enum: ['active', 'suspended', 'banned'] },
    suspended_until: { type: Date, default: null },
    suspend_reason: { type: String, default: '' },
    ban_reason: { type: String, default: '' },
    point: {type: Number, default: 0},
    xp: {type: Number, default: 0},
    level: {type: Number, default: 1},
    massege_list: {type: Array, default: []},
    writer_count: {type: Number, default: 0},
    liked_file_list: {type: Array, default: []}


    
});

export const purchaseSchema = new Schema({
    user_id: {type: Schema.Types.ObjectId, required: true},
    file_id: {type: Schema.Types.ObjectId, required: true},
    file_type: {type: String, required: true},
    price: {type: Number, required: true},
    createdAt: { type: Date, default: Date.now },
});
purchaseSchema.index({user_id: 1, file_id: 1}, {unique: true});

export const pointChargeSchema = new Schema({
    order_id: {type: String, required: true, unique: true},
    user_id: {type: Schema.Types.ObjectId, required: true},
    amount: {type: Number, required: true},
    status: {type: String, default: 'ready', enum: ['ready', 'paid', 'failed']},
    payment_key: {type: String, default: ''},
    method: {type: String, default: ''},
    createdAt: { type: Date, default: Date.now },
    approved_at: {type: Date, default: null},
});

export const chatroomSchema = new Schema({
    type: {type: String, required: true},
    auction_id: {type: Schema.Types.ObjectId, required: true},
    createdAt: { type: Date, default: Date.now },
    participants: {type: [Schema.Types.ObjectId], required: true},
    last_message: {type: String, default: ''},
    last_message_time: {type: Date, default: Date.now},
});


export const messageSchema = new Schema({
    room_id: {type: Schema.Types.ObjectId, required: true},
    sender_id: {type: Schema.Types.ObjectId, required: true},
    content: {type: String, required: true},
    isRead: {type: Boolean, default: false},
    createdAt: { type: Date, default: Date.now },
    //ref:'chatrooms'
});
    

export const filesSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    createdAt: { type: Date, default:Date.now },
    uploader: {type: String, required: true},
    path: {type: String, required: true},
    size: {type: String, required: true},
    type: {type: String, required: true},
    price: {type: Number, required: true},
    download_type: {type: String, required: true},
    download_count: {type: Number, required: true},
    start_price: {type: Number, default: 0},
    end_time: {type: Date},
    /*
    like_count: {type: Number, required: true},
    comment_count: {type: Number, required: true},
    view_count: {type: Number, required: true}*/


});

export const gymsSchema = new Schema({
    file_id: { type: Schema.Types.ObjectId, required: true },
    file_type: { type: String, required: true }, // image, video, audio, document, app

    title: { type: String, required: true },
    description: { type: String, required: true },
  
    seller_id: { type: Schema.Types.ObjectId, required: true },
    seller_name: { type: String, required: true },
  
    start_price: { type: Number, required: true },
    current_price: { type: Number, default: 0 },
    min_bid_unit: { type: Number, default: 100 },
  
    highest_bidder_id: { type: Schema.Types.ObjectId, default: null },
    highest_bidder_name: { type: String, default: '' },
    highest_bidder_price: { type: Number, default: 0 },
  
    start_time: { type: Date, default: Date.now },
    end_time: { type: Date, required: true },
  
    status: {
      type: String,
      default: 'active',
      enum: ['active', 'ended', 'cancelled', 'paid', 'failed']
    },
  
    bid_count: { type: Number, default: 0 },
  
    createdAt: { type: Date, default: Date.now }

});


export const gymBidsSchema = new Schema({
    auction_id: { type: Schema.Types.ObjectId, required: true },
  
    bidder_id: { type: Schema.Types.ObjectId, required: true },
    bidder_name: { type: String, required: true },
  
    bid_price: { type: Number, required: true },
  
    createdAt: { type: Date, default: Date.now }
  });

  export const gymResultsSchema = new Schema({
    auction_id: { type: Schema.Types.ObjectId, required: true },
  
    winner_id: { type: Schema.Types.ObjectId, default: null },
    winner_name: { type: String, default: '' },
  
    final_price: { type: Number, required: true },
  
    seller_id: { type: Schema.Types.ObjectId, required: true },
    file_id: { type: Schema.Types.ObjectId, required: true },
    file_type: { type: String, required: true },
  
    is_paid: { type: Boolean, default: false },
    is_downloadable: { type: Boolean, default: false },
  
    endedAt: { type: Date, default:Date.now }

  });


export const communitySchema = new Schema({
    category: {
        type: String,
        required: true,
        enum: ['talk', 'share', 'question', 'notice'],
    },
    title: { type: String, required: true },
    content: { type: String, required: true },

    writer_id: { type: Schema.Types.ObjectId, required: true },
    writer: { type: String, required: true },

    view_count: { type: Number, default: 0 },
    like_count: { type: Number, default: 0 },
    like_list: { type: Array, default: [] },
    comment:{type: Array,default:[]},
    comment_count: { type: Number, default: 0 },

    is_deleted: { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now },
});


export const gymChatsSchema = new Schema({
  auction_id: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
  },

  room_id: {
    type: String,
    required: true,
  },

  sender_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },

  sender_name: {
    type: String,
    required: true,
  },

  message: {
    type: String,
    required: true,
  },

  message_type: {
    type: String,
    enum: ['chat', 'system', 'bid'],
    default: 'chat',
  },

  bid_price: {
    type: Number,
    default: null,
  },

  is_deleted: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});