import mongoose from "mongoose";
const rentalModel = new mongoose.Schema({
    homeId : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'Home',
        require : true,
    },
    tenantId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        require : true,
    },
    leasePeriod : {
        type : Number,
        min: 0
    },
    cost: {
        type : Number,
        min: 0
    },
    endTime : {
        type : Date
    },
    rentalStatus :{ 
        type : Boolean
    },
    hostId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        require : true,
    }
    
},{timestamps : true})


const RentalModel = mongoose.model('rental', rentalModel);

export default RentalModel;