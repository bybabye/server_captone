
import mongoose from "mongoose";


const chatModel = new mongoose.Schema({

    type : {
        type : String,
        enum : ['gruop','private'],
        default : 'private'
    },
    membersId : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }],
   
},{timestamps : true})


const ChatModel = mongoose.model('Chat', chatModel);

export default ChatModel;