import HomeModel from "../models/homeModels.js";
import fs from "fs";
import UserModel from "../models/userModels.js";
import CommentModel from "../models/commentModel.js";

// thêm nhà từ chủ căn hộ
export const addHome = async (req, res) => {
  try {
    const uid = res.locals.uid;
    const { address, price, des, images, status, roomArea, ownerId } = req.body;
    const user = await UserModel.findOne({ uid });
    if (user.roles !== "host") {
      return res
        .status(404)
        .send({ message: "You can not allow to posted post" });
    }
    const newHome = new HomeModel({
      address,
      price,
      des,
      images,
      status,
      roomArea,
      ownerId,
    });
    await newHome.save();
    return res.status(201).send("Home created successfully");
  } catch (error) {
    console.log(error);

    return res.status(500).send({ message: "Internal server error" });
  }
};
/*
Tìm kiếm danh sách home.
query : page // trang đang ở hiệN tại

*/
export const listHome = async (req, res) => {
  try {
    // lấy giá trị của trang từ param . Mặc định page = 1
    const page = parseInt(req.query.page) || 1;
    const homeSize = 12; // giới hạn số bản ghi cần phải lấy

    const skipCount = (page - 1) * homeSize; // tính số bản khi cần bỏ qua;
    const data = await HomeModel.find({
      status : true
    })
      .populate({
        path: "ownerId",
      })
      .skip(skipCount)
      .limit(homeSize); //12 

    return res.status(200).send(data);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};
/*
Tìm kiếm home từ id home

*/
export const homeForId = async (req, res) => {
  try {
    const postId = req.query.postId;
    const home = await HomeModel.findById(postId).populate({
      path: "ownerId",
      // select neu co
    });
  // home Id
  // review => 
    const comments = await CommentModel.find({homeId : home._id}).populate({path: "authorId"}) ?? [];
    const data = {
      address: home.address,
      _id: home._id,
      price: home.price,
      utilities: home.utilities,
      roomType: home.roomType,
      des: home.des,
      images: home.images,
      status: home.status,
      ownerId: home.ownerId,
      comments: comments,
      __v: home.__v,
      currentTenant: home.currentTenant,
    };
    if (!home) {
      return res.status(404).send({ message: "Post not found" });
    }
    return res.status(200).send(data);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};
/*
Tìm kiếm home từ địa chỉ
địa chỉ tìm kiếm là quận,phường,thành phố

*/
export const searchHomeForAddress = async (req, res) => {
  try {
    const { subDistrict, district, city } = req.query;
    const query = {};

    // Thêm điều kiện tìm kiếm cho subDistrict nếu có giá trị
    query["address.subDistrict"] =
      subDistrict !== undefined ? subDistrict : { $exists: true };
    query["address.district"] =
      district !== undefined ? district : { $exists: true };
    query["address.city"] = city !== undefined ? city : { $exists: true };
    const homes = await HomeModel.find(query);
    console.log(homes.length);
    return res.status(200).send(homes);
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
};
/*
Xoá bài viết muốn cho thuê nhà
Chỉ được xoá từ chủ căn nhà. 

*/
export const deleteHome = async (req, res) => {
  try {
    // lấy id người dùng
    const uid = res.locals.uid;
    // lấy id từ post để xoá
    const postId = res.params.postId;
    const user = await UserModel.findOne({ uid });
    const home = await HomeModel.findOne({
      _id: postId,
      ownerId: user.uid,
    });
    if (!user || !home) {
      return res
        .status(404)
        .send({ message: "Home not found or does not belong to the user" });
    }
    
    // Nếu bài đăng tồn tại và thuộc về người dùng, thì xóa nó
    await home.remove();
    return res.status(200).send({ message: "Home deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

/*
thêm người đang thuê . 
Chỉ được thêm từ chủ căn nhà. 
Và chuyển trạng thái của căn nhà từ còn phòng thành trống phòng
*/

export const updateTenant = async (req, res) => {
  try {
    const postId = req.query.postId;
    const uid = res.locals.uid;
    const user = await UserModel.findOne({ uid });
    const currentTenant = req.query.currentTenant;
    const home = await HomeModel.findOne({
      _id: postId,
      ownerId: user._id,
    });
    if (home) {
      // nếu id có trong người từng thuê không có add nữa
      await home.updateOne(
        {
          $set: {
            currentTenant: currentTenant,
            status: false,
          },
        },
        { new: true } // Trả về tài liệu sau khi đã cập nhật
      );
      return res.status(200).send({ message: "Home update Tenant successfully" });
    } else {
      return res.status(404).send({ message: "Home Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};
/*
gỡ người đã thuê và chuyển trạng thái còn phòng
Chỉ được update từ chủ căn nhà. 

*/

export const removeCurrentTenant = async (req, res) => {
  try {
    const postId = req.query.postId;
    const uid = res.locals.uid;
    const user = await UserModel.findOne({ uid });

    const home = await HomeModel.findOne({
      _id: postId,
      ownerId: user._id,
    });
    if (home) {
      await home.updateOne(
        {
          $set: {
            currentTenant: null,
            status: true,
          },
        },
        { new: true } // Trả về tài liệu sau khi đã cập nhật
      );
      return res
        .status(200)
        .send({ message: "Home current tenant update successfully" });
    } else {
      return res.status(404).send({ message: "Home Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

//
