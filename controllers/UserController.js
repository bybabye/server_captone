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
  const { uid } = req.body;

  try {
    const user = await UserModel.findOne({
      uid: uid,
    });
    console.log(user);
    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error user");
  }
};
// ham nay se co 1 cai context uid de xac nhan la chinh chu.
export const updateUser = async (req, res) => {
  const newdata = req.body;
  const uid = res.locals.uid;
  console.log(uid);
  if(!newdata) {
    return res.status(403).send("not data from client");
  }
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
    res.status(500).send("Error user");
  }
};
export const listUser = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.send({ data: users });
  } catch (error) {
    res.send({ error });
  }
};
