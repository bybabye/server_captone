import HomeModel from "../models/homeModels.js";
import fs from "fs";

export const addHome = async (req, res) => {
  const { address, price, des, images, status, roomArea, ownerId } = req.body;

  try {
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
    return res.status(500).send("Error saving home");
  }
};

export const listHome = async (req,res) => {
    try {
      // lấy giá trị của trang từ param . Mặc định page = 1

      const page = parseInt(req.query.page) || 1
      const homeSize = 12; // giới hạn số bản ghi cần phải lấy

      const skipCount = (page - 1) * homeSize ; // tính số bản khi cần bỏ qua;
      


      const data = await HomeModel.find().skip(skipCount).limit(homeSize);
       
      return res.status(200).send(data);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Error ");
    }
}


export const deleteHome = async (req,res) => {
  try {
     await HomeModel.deleteMany({});
     return res.status(200).send("Da xoa het du lieu");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error ");
  }
}


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
      for(let i = 0 ; i < dt.length ;i++) {

          const newHome = new HomeModel({
            ...dt[i],ownerId : "64fad036c7a97114a7c9cac5"
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
