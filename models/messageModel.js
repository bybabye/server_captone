import mongoose from "mongoose";
const messageModel = new mongoose.Schema({
    chatId : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'Chat',
        require : true,
    },
    messId : {
        type : String,
        require : true
    },
    type : {
        type : String,
        enum : ['video','text','voice','image'],
        default : 'text'
    },
    content : {
        type : String,
        require : true
    },
    senderId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        require : true,
    },
    sentTime : {
        type : Date,
        require : true,
    },
    // user da delete
    deleted : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        }
    ]
},{timestamps : true})


const MessageModel = mongoose.model('Message', messageModel);

export default MessageModel;