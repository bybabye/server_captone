import mongoose from "mongoose";

const userModel = new mongoose.Schema({
    userName : {
        type : String,
        require : true,
    },
    uid : {
        type : String,
        require : true
    },
    avatar : {
        type : String,
    },
    address : {
        type : String,
    },
    phoneNumber : {
        type : String,
    },
    roomfavorites : {
        type : [String]
    },
    cID: {
        fullName : {
            type : String,
        },
        no : {
            type : String,
        },
        image : {
            type : String,
        },
        sex : {
            type : String,
            enum : ['nam','nu'],
            default : 'nam'
        },
        placeOfOrigin : {
            type : String,
            
        },
        dateOfBirth : {
            type : Date,
        },
        placeOfResidence: {
            type : String,
        }
    },
    roles : {
        type : String,
        enum : ['user','admin','host'],
        default : 'user',
    }
})

const UserModel = mongoose.model('User',userModel);


export default UserModel;