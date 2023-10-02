import { db } from "../firebaseConfig.js";
import { v4 as uuidv4 } from "uuid";
import UserModel from "../models/userModels.js";
import {format} from 'date-fns';

export const addChat = async (req, res) => {
  const { memberId, type } = req.body;
  console.log("dang xai add");
  const uid = res.locals.uid;
  const yUser = await UserModel.findOne({ uid: memberId });
  const typeChat = {
    gruop: "gruop",
    private: "private",
  };
  if (!(type in typeChat)) {
    return res.status(404).send({ message: "Add chat error for type " });
  }
  try {
    const querySnapshot = await db
      .collection("chats")
      .where("members", "array-contains-any", [memberId, uid])

      .get();

    if (!querySnapshot.empty) {
      // Nếu tìm thấy cuộc trò chuyện chứa cả hai memberId
      // Trả về chatId của cuộc trò chuyện đầu tiên tìm thấy
      return res.status(200).send({
        message: "Chat already exists ",
        chatId: querySnapshot.docs[0].data().chatId,
        data: {
          yid: yUser.uid,
          avatar: yUser.avatar,
          userName: yUser.userName,
        },
      });
    } else {
      const chatId = uuidv4();
      const data = {
        chatId,
        type: type,
        members: [memberId, uid],
      };
      const response = await db.collection("chats").doc(chatId).set(data);

      console.log(response);
      return res
        .status(200)
        .send({
          message: "Chat created successfully ",
          chatId,
          data: {
            yid: yUser.uid,
            avatar: yUser.avatar,
            userName: yUser.userName,
          },
        });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

export const getChat = async (req, res) => {
  const chatId = req.query.chatId;
  try {
    const doc = await db.collection("chats").doc(chatId).get();
    if (!doc.exists) {
      return res.status(500).send({ message: "No Chat for database" });
    } else {
      return res.status(200).send(doc.data());
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

export const sendMessages = async (req, res) => {
  const chatId = req.query.chatId;
  const { senderId, type, content } = req.body;
  console.log(senderId, type, content, chatId);
  const currentDate = new Date();
  try {
    const typeMessages = {
      text: "text",
      image: "image",
      video: "video",
      voice: "voice",
    };
    if (!(type in typeMessages)) {
      return res.status(404).send({ message: "Send mess error" });
    }
    const data = {
      chatId,
      mid : uuidv4(),
      type,
      content,
      senderId,
      sendTime: currentDate,
    };
    const response = await db
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .doc(uuidv4())
      .set(data);
    console.log(response);
    return res.status(200).send("Message created successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};
let unsubscribe;
export const getMessagesForChatId = async (req, res) => {
  const chatId = req.query.chatId;
  console.log(chatId);
  let hasSentResponse = false;
  try {
    const messages = [];
     unsubscribe = db
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .orderBy("sendTime", "desc")
      .onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().map((change) => {
          const messageData = change.doc.data();
          const formattedSendTime = format(messageData.sendTime.toDate(), "PPPPp"); // Sử dụng định dạng bạn muốn ở đây
         
          messages.push({...messageData, sendTime: formattedSendTime });
        });
        // Kiểm tra xem đã gửi phản hồi chưa
        if (!hasSentResponse) {
          // Gửi phản hồi khi có thay đổi và đánh dấu đã gửi
          console.log(messages);
          res.status(200).send(messages);
          hasSentResponse = true;
        }
      });
      
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
};

const unsubscribeFromChat = () => {
  if (unsubscribe) {
    unsubscribe(); // Gọi hàm unsubscribe để ngắt kết nối với Firestore
    console.log("Unsubscribed from chat.");
  } else {
    console.log("No active subscription to unsubscribe from.");
  }
};
