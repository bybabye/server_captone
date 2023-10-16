

import mongoose from "mongoose";

const commentModel = new mongoose.Schema({
    content : {
        type : String,
        require : true,
    },
    homeId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Home'
    },
    authorId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        require : true
    }
})

const CommentModel = mongoose.model('Comment',commentModel);


export default CommentModel;


