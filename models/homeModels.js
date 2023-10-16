


import mongoose from "mongoose";


const homeModel = new mongoose.Schema({
    address : {
        stress : String,
        subDistrict : String,
        district: String,
        city : String
    },
    price : {
        type : Number,
        min : 0
    },
    roomArea: {
        type: Number, // Kiểu dữ liệu là Number
        min: 0 // Giá trị tối thiểu là 0 
    },
    utilities : {
        type : [String],
    },
    roomType : {
        type : String,
        enum : ['Nhà Trọ & Phòng Trọ','Nhà Nguyên Căn','Chung Cư'],
        default : 'Nhà Trọ & Phòng Trọ'
    },
    des : {
        type : [String],
        require : true 
    },
    images : {
        type : [String],
    },
    status : {
        type : Boolean, // Kiểm tra xem phòng còn trống hay không . còn phòng or hết phòng.
        required : true,
        default : true
    },
    // commnets : [{
    //     type : mongoose.Schema.Types.ObjectId,
    //     ref : 'Comment'
        //  
    // }],
    
    ownerId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        require : true,
    },
    // tenants: [{ // người thuê nhà và đã từng thuê dùng để quản lý comment bài viết
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User'
    // }],
    currentTenant: { // dùng để theo dõi người đang thuê
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

const HomeModel = mongoose.model('Home', homeModel);

export default HomeModel;