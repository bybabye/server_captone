import ReportModel from "../models/reportModel.js";
import UserModel from "../models/userModels.js";

export const addUser = async (req, res) => {
  const { userName, uid, cmnd, avatar } = req.body;
  try {
   

    if (uid == null) {
      return res.status(400).send({ message: "Your information is invalid" });
    }
    const user = await UserModel.findOne({ uid }); 
    if (user) {
      console.log("The user is already in the database");
      return res
        .status(200)
        .send({ message: "The user is already in the database",data: user });
    }

    const newUser = new UserModel({
      userName,
      uid,
      avatar,
      cID: { no: cmnd },
    });
    await newUser.save();
    return res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

export const getUser = async (req, res) => {
  const uid = res.locals.uid;
  console.log(uid, "Dang loggin....");
  try {
    const user = await UserModel.findOne({
      uid: uid,
    });

    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};
// ham nay se co 1 cai context uid de xac nhan la chinh chu.
export const updateUser = async (req, res) => {
  const newdata = req.body;
  const uid = res.locals.uid;
  delete newdata.uid;
  delete newdata.roles;
  console.log(uid, "Dang update....");
  if (!newdata) {
    return res.status(404).send({message : "Not Data From Client"});
  }
  // chặn user có thể update uid và roles bằng code.
  // if(newdata.uid && newdata.roles === 'host')
  //   return res.status(404).send("Not Update uid and roles ")
  if (newdata.dateOfBirth === "") {
    delete newdata.dateOfBirth;
  } else if (isValidDate(newdata.dateOfBirth)) {
    // Nếu chuỗi dateOfBirth có thể chuyển đổi thành định dạng thời gian
    // Thì chuyển đổi nó và gán vào temporaryData
    newdata.dateOfBirth = new Date(newdata.dateOfBirth);
    console.log("da convet thanh cong");
  }else{
    console.log("convert k thanh cong");
  }
  const temporaryData = {
    userName: newdata.userName === "" ? null : newdata.userName,
    address: newdata.address === "" ? null : newdata.address,
    phoneNumber: newdata.phoneNumber === "" ? null : newdata.phoneNumber,
    "cID.fullName": newdata.fullName === "" ? null : newdata.fullName,
    "cID.no": newdata.no === "" ? null : newdata.no,
    "cID.sex": newdata.sex === "" ? null : newdata.sex,
    "cID.placeOfOrigin":
      newdata.placeOfOrigin === "" ? null : newdata.placeOfOrigin,
    "cID.dateOfBirth": newdata.dateOfBirth,
    "cID.placeOfResidence":
      newdata.placeOfResidence === "" ? null : newdata.placeOfResidence,
  };
  console.log(temporaryData);
  // phải khoá rolers ở cái này.
  try {
    const user = await UserModel.findOneAndUpdate(
      { uid }, //Sử dụng uid làm điều kiện tìm kiếm
      {
        $set: temporaryData,
      },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    console.log(user);
    return res.status(200).send({ message: "Updated profile successfully",data : user });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};
// dùng cho admin xem
export const listUser = async (req, res) => {
  try {
    const users = await UserModel.find({ roles: { $ne: "admin" } });
    return res.send({ data: users });
  } catch (error) {
    return res.send({ error });
  }
};
export const changeUserUpHost = async (req, res) => {
  const uid = res.locals.uid;
  try {
    const user = await UserModel.findOne({ uid });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
   
    
    if (
      user.cID.fullName ||
        user.cID.no ||
        user.cID.placeOfOrigin ||
        user.cID.dateOfBirth ||
        user.cID.placeOfResidence ||
        user.phoneNumber
    ) {
      return res
        .status(400)
        .json({ message: "You must fill in all information!" });
    }
    const updatedUser = await UserModel.findOneAndUpdate(
      {
        uid, // //Sử dụng uid làm điều kiện tìm kiếm
      },
      {
        $set: {
          roles: "host",
        },
      },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    return res.status(200).json({ message: "User role updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createReport = async (req,res) => {
  const uid = res.locals.uid;
  const homeId = req.query.homeId;
  const {title ,Objective} = req.body;
  try {
    const user = await UserModel.findOne({ uid });
    const newReport = new ReportModel({
      title ,
      Objective,
      homeId,
      authorId : user._id
    })
    await newReport.save();

    return res.status(200).json({message : "Report created sucessfully" , data : newReport})
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

//
function isValidDate(dateString) {
  const regExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
  if (!regExp.test(dateString)) {
    return false;
  }

  const date = new Date(dateString);
  return !isNaN(date);
}