import UserModel from "../models/userModels.js";

export const addUser = async (req, res) => {
  const { userName, roles } = req.body;

  try {
    const newUser = new UserModel({
      userName,
      roles,
    });
    await newUser.save();
    res.status(201).send("User created successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error saving user");
  }
};

export const getUser = async (req, res) => {
  const uid = res.locals.uid;
  console.log(uid , "Dang loggin....");
  try {
    const user = await UserModel.findOne({
      uid: uid,
    });

    return res.status(200).send(user);
  } catch (error) {
    res.status(500).send({message : error});
  }
};
// ham nay se co 1 cai context uid de xac nhan la chinh chu.
export const updateUser = async (req, res) => {
  const newdata = req.body;
  const uid = res.locals.uid;
  console.log(uid);
  if(!newdata) {
    return res.status(404).send("Not Data From Client");
  }
  // chặn user có thể update uid và roles bằng code.
  if(newdata.uid && newdata.roles === 'host')
    return res.status(404).send("Not Update uid and roles ")
  
  // phải khoá rolers ở cái này.
  try {
    const user = await UserModel.findOneAndUpdate(
        {uid }, //Sử dụng uid làm điều kiện tìm kiếm
      {
        $set: newdata,  
      },
      { new: true }
    );
    if (!user) {
      return res.status(404).send("User not found");
    }

    console.log(user);
    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};
// dùng cho admin xem
export const listUser = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.send({ data: users });
  } catch (error) {
    res.send({ error });
  }
};
export const changeUserUpHost = async (req,res) => {
  const uid = res.locals.uid;
  try {
    const user = await UserModel.findOne({uid});
    if(!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    if(!(user.cID.fullName || user.cID.no 
      || user.cID.placeOfOrigin || user.cID.dateOfBirth || user.cID.placeOfResidence)   
    && !user.phoneNumber) {
      return res.status(404).json({ message: "You must fill in all information!" });
    }
    const updatedUser = await UserModel.findOneAndUpdate({
      uid // //Sử dụng uid làm điều kiện tìm kiếm
    },
    {
      $set : {
        roles : "host"
      }
    },{ new: true }
    )
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    return res.status(200).json({ message: "User role updated successfully"});
    
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}
