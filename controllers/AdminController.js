import ReportModel from "../models/reportModel.js";
import UserModel from "../models/userModels.js";

export const blockUser = async (req, res) => {
    const userIdToBlock = req.params.userId;

    try {
        const userToBlock = await UserModel.findByIdAndUpdate(
            userIdToBlock,
            { isBlocked: true },
            { new: true } // Trả về người dùng đã được cập nhật
        );

        if (!userToBlock) {
            return res.status(404).send({ message: "User not found" });
        }
        return res.status(200).send({ message: "User blocked successfully",data : userToBlock });
       
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

export const findUsersByPartialUsername = async (req, res) => {
    const partialUsername = req.params.partialUsername;

    try {   
        // Sử dụng $regex để tìm kiếm theo phần từ của userName
        // i la k phan biet hoa thuong
        const users = await UserModel.find({ userName: { $regex: partialUsername, $options: 'i' } });

        if (users.length === 0) {
            return res.status(404).send({ message: 'No users found' });
        }

        return  res.status(200).send({ message: 'Users found successfully', users });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};


export const listReport = async (req,res) => {
    try {
        const reports  = await ReportModel.find().populate('homeId').populate('authorId');

        return res.status(200).send({data : reports});
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
}