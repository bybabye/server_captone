import mongoose from "mongoose";

const userModel = new mongoose.Schema({
  userName: {
    type: String,
    require: true,
  },
  uid: {
    type: String,
    require: true,
    unique: true,
  },
  avatar: {
    type: String,
  },
  address: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  cID: {
    fullName: {
      type: String,
    },
    no: {
      type: String,
      unique : true,
      sparse: true, // cho phep ghi vao la null nhung khong bi trung lap
      required : false,
    },
    
    image: {
      type: String,
    },
    sex: {
      type: String,
      enum: ["nam", "nu"],
      default: "nam",
    },
    placeOfOrigin: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    placeOfResidence: {
      type: String,
    },
  },
  roles: {
    type: String,
    enum: ["user", "admin", "host"],
    default: "user",
  },
  isBlocked: { type: Boolean, default: false },
});

const UserModel = mongoose.model("User", userModel);

export default UserModel;
