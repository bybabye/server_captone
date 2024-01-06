

import UserModel from "../models/userModels.js";



export const authorizationBlock = async (req,res,next) => {
    const uid = res.locals.uid;
    console.log(uid);

    try {
        const user = await UserModel.findOne({ uid  });
        if (user.isBlocked) {
            return res.status(401).json({ message: "User have been blocked" });
        }
       
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}