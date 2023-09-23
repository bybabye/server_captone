import HomeModel from "../models/homeModels.js";
import fs from "fs";
import UserModel from "../models/userModels.js";

export const addHome = async (req, res) => {
  const uid = res.locals.uid;
  const { address, price, des, images, status, roomArea, ownerId } = req.body;

  try {
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

export const listHome = async (req, res) => {
  try {
    // lấy giá trị của trang từ param . Mặc định page = 1
    const page = parseInt(req.query.page) || 1;
    const homeSize = 12; // giới hạn số bản ghi cần phải lấy

    const skipCount = (page - 1) * homeSize; // tính số bản khi cần bỏ qua;
    const data = await HomeModel.find()
      .populate({
        path: "ownerId",
      })
      .skip(skipCount)
      .limit(homeSize);

    return res.status(200).send(data);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

export const homeForId = async (req, res) => {
  const postId = req.query.postId;
  try {
    const post = await HomeModel.findById(postId).populate({
      path: "ownerId",
      // select neu co
    });
    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }
    return res.status(200).send(post);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

export const searchHomeForAddress = async (req, res) => {
  const { subDistrict, district, city } = req.query;
  console.log(subDistrict, district, city);
  try {
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

export const deleteHome = async (req, res) => {
  // lấy id người dùng
  const uid = res.locals.uid;
  // lấy id từ post để xoá
  const postId = res.body.postId;
  try {
    const user = await UserModel.findOne({ uid });
    if (!user) {
      return res
        .status(404)
        .send({ message: "Home not found or does not belong to the user" });
    }
    const home = await HomeModel.findOne({
      _id: postId,
      ownerId: user.uid,
    });
    if (!home) {
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

export const addQuickLy = async (req, res) => {
  try {
    fs.readFile("rooms.json", "utf8", async (err, data) => {
      if (err) {
        console.error("There was an error reading the file:", err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }

      // Parse the JSON data from the file
      const jsonData = JSON.parse(data);

      const dt = jsonData.map((room) => {
        const address = {
          stress: "",
          subDistrict: "",
          district: "",
          city: "",
        };
        const arr = room.address.split(",");
        if (arr.length === 2) {
          address.stress = arr[0].trim();
          address.city = arr[1].trim();
        } else if (arr.length === 3) {
          address.stress = arr[0].trim();
          address.district = arr[1].trim();
          address.city = arr[2].trim();
        } else if (arr.length === 4) {
          address.stress = arr[0].trim();
          address.subDistrict = arr[1].trim();
          address.district = arr[2].trim();
          address.city = arr[3].trim();
        } else if (arr.length === 5) {
          address.stress = arr[0].trim();
          address.subDistrict = arr[2].trim();
          address.district = arr[3].trim();
          address.city = arr[4].trim();
        } else {
          address.city = arr[0].trim();
        }
        return {
          ...room,
          address: address,
        };
      });
      for (let i = 0; i < dt.length; i++) {
        const newHome = new HomeModel({
          ...dt[i],
          ownerId: "64fad036c7a97114a7c9cac5",
        });
        await newHome.save();
      }
      // Extract links from jsonData

      res.status(200).send(dt);
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error saving home");
  }
};
