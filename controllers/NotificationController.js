import NotificationModel from "../models/notificationModel.js";
import UserModel from "../models/userModels.js";



export const addNotification = async (req,res) => {
    try {
        const senderId = res.locals.uid;
        const myUserId = await UserModel.findOne({uid : senderId})
        const {receiverId,target,targetId,content} = req.body;
        console.log(receiverId,target,targetId,content);
        const newNotifi =  NotificationModel({
            senderId : myUserId._id,
            receiverId : receiverId,
            target : target,
            targetId : targetId,
            content : content,
            read : false
        })
        await newNotifi.save();
        return res.status(200).send({ message: "Notification created successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Internal server error" });
    }
} 

export const readNotificationForId = async (req,res) => {
    try {
        const notifiId = req.query.notifiId;
        const notifi = await NotificationModel.findOne({_id : notifiId});
        await notifi.updateOne({
            $set : {
                read : true
            }
        })
        return res.status(200).send({ message: "Notification Change Status successfully" });
    } catch (error) {
        return res.status(500).send({ message: "Internal server error" });
    }
}

export const listNotification = async (req,res) => {
    try {
        const uid = res.locals.uid;
        const user = await UserModel.findOne({uid})
        const notifications = await NotificationModel.find({
            receiverId : user._id
        }).sort({
            createdAt : -1,
        }).populate('senderId',)
        return res.status(200).send({
            data : notifications
        })

    } catch (error) {
        return res.status(500).send({ message: "Internal server error" });
    }
}