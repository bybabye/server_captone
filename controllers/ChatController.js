
import UserModel from "../models/userModels.js";
import ChatModel from "../models/chatModel.js";
import mongoose from "mongoose";
import MessageModel from "../models/messageModel.js";
import { format } from "date-fns"; 
//
export const addChat = async (req, res) => {
  const { senderId } = req.body;
  const uid = res.locals.uid;
  try {
    // Bước 1: Tìm người dùng bạn muốn trò chuyện với
  
    const [myUser, yUser] = await Promise.all([
      UserModel.findOne({ uid: uid }),
      UserModel.findOne({ uid: senderId }),
    ]);
    if (!myUser || !yUser) {
      return res.status(404).send({ message: "User not found" });
    }
    const myUserId = new mongoose.Types.ObjectId(myUser._id);
    const yUserId = new mongoose.Types.ObjectId(yUser._id);
    // Bước 2: Kiểm tra xem cuộc trò chuyện với cả hai thành viên đã tồn tại chưa
    const chat = await ChatModel.findOne({
      membersId: {
        $exists: true,
        $all: [myUserId, yUserId],
      },
    }).populate('membersId','userName avatar uid');
    if (chat) {
      // Nếu tìm thấy cuộc trò chuyện chứa cả hai memberId
      // Trả về chatId của cuộc trò chuyện đầu tiên tìm thấy
     
      return res.status(200).send({
        message: "Chat already exists ",
        data: chat,
      });
      
    } else {
      const newChat = new ChatModel({
        membersId: [myUserId, yUserId],
      });
      await newChat.save();
      // Nạp thông tin thành viên của cuộc trò chuyện bằng populate
      const chat = await ChatModel.findById(newChat._id).populate('membersId','userName avatar uid');
     
      return res.status(201).send({
        message: "Chat created successfully",
        data: chat,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

export const getChatForId = async (req,res) => {
  try {
    
    const uid = res.locals.uid;
    
    const chatId = req.query.chatId;
    
    const user = await UserModel.findOne({uid});

    const chat = await ChatModel.findById(chatId);
    const idUser = chat.membersId.find(e => e.toString() !== user._id.toString());
    const guest = await UserModel.findOne({_id : idUser},{userName : 1,avatar : 1},).exec()
    console.log(guest);
    return res.status(200).send({ data: chat,guest});

  }catch(error){
    console.log("getChatForId" + error);
    return res.status(500).send({ message: "Internal server error" });
  }
}

export const deleteMessage = async (req,res) => {
  try {
    
    const uid = res.locals.uid;
    const messId = req.query.messId;
    const chatId = req.query.chatId;
    
    const user = await UserModel.findOne({uid});
    
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    console.log(user._id);
    const message = await MessageModel.findOne({
      _id : messId,
      chatId : chatId,
      senderId : user._id
    })
    console.log(message);
    if(message) {
      return res.status(200).send({ message: "Message deteled successfully" });
    }else{
      return res.status(404).send({ message: "You do not have permission to delete this message" });
    }
  } catch (error) {
    console.log("Lỗi ở delete message" + error);
    return res.status(500).send({ message: "Internal server error" });
  }
}


export const getListChat = async (req,res) => {
  try {
    const uid = res.locals.uid;
    // lấy user từ database
    const user = await UserModel.findOne({uid}) 
    const myUserId = new mongoose.Types.ObjectId(user._id);
    // tìm tất cả các list chat trong database có chứa uid trong membersId . Nâng thêm vào private nếu sau này có gruop
    const chats = await ChatModel.find({
      membersId : {$in : [myUserId]}
    }).populate('membersId','userName avatar uid');
    // Lọc ra các cuộc trò chuyện chưa bị xoá bởi người dùng hiện tại
    
    console.log(chats);
    return res.status(200).send({
      message: "List of chats retrieved successfully",
      data: chats,
    });
  } catch (error) {
    console.log(`Lỗi ở hàm get List chat ${error}`);
    return res.status(500).send({ message: "Internal server error" });
  }
}



// phải kiểm tra người nhắn có phải là người trong chat hay không?
export const sendMessages = async (req,res) => {
  try {
    const {type,content,mId} = req.body;
    const chatId = req.query.chatId;
    const uid = res.locals.uid;
    console.log(chatId,type,content);
    const user = await UserModel.findOne({uid})
    const mChatId = new mongoose.Types.ObjectId(chatId);
    const newMessage = new MessageModel({
      messId : mId,
      senderId : user._id,
      chatId : mChatId ,
      content,
      type,
      sentTime : Date()
    })
    await newMessage.save();
    return res.status(201).send({
      message: "Message created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
       message: "Internal server error" });
  }
}

// đặt cờ kiểm tra xem uid có trong mess này hay không.
export const getListMessages = async (req,res) => {
  try {
    const chatId = req.query.chatId;
    const mChatId = new mongoose.Types.ObjectId(chatId);

    const data = await MessageModel.find({
      chatId : mChatId
    });
    
    return res.status(200).send({
      message: "List of messages retrieved successfully",
      data : data
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
}
//
export const deleteChatForChatId = async (req,res) => {
  try {
    const chatId = req.query.chatId;
    const messages = await MessageModel.deleteMany({chatId : chatId})
    return res.status(200).send({
      message: "List of messages deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
}