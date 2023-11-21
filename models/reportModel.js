import mongoose from "mongoose";
const reportModel = new mongoose.Schema({
    title : {
        type : String,
        require : true
    },
    Objective : {
        type : String,
        enum : ['violence','spam','hateful language','false information','other'],
        default : 'false information'
    },
    status : {
        type : Boolean,
        default : false
    },
    homeId : {
        type : mongoose.Schema.ObjectId,
        ref : 'Home',
        require : true,
    },
    authorId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        require : true,
    }
    
},{timestamps : true})


const ReportModel = mongoose.model('report', reportModel);

export default ReportModel;