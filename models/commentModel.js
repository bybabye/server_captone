

import mongoose from "mongoose";

const commentModel = new mongoose.Schema({
    text : {
        type : String,
        require : true,
    },
    
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
    }
})

const CommentModel = mongoose.model('Comment',commentModel);


export default CommentModel;