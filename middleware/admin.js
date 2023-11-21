import UserModel from "../models/userModels.js";



export const authorizationAdmin = async (req,res,next) => {
    const uid = res.locals.uid;
    console.log(uid);

    try {
        const user = await UserModel.findOne({ uid  });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log(user.roles);

        if (user.roles !== "admin") {
            return res.status(401).json({ message: "Unauthorized" });
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}