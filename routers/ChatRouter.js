import express from "express";


import { addChat, deleteMessage, getChatForId, getListChat, getListMessages, sendMessages  } from "../controllers/ChatController.js";





const ChatRouter = express.Router(); 

ChatRouter.post('/chat/add',addChat);
ChatRouter.get('/chat/list',getListChat);
ChatRouter.post('/chat/message/send',sendMessages);
ChatRouter.get('/chat/message/list',getListMessages);
ChatRouter.get('/chat/message',getChatForId);
ChatRouter.delete('/chat/delete',deleteMessage);
// HomeRouter.get('/home/add/quickly',addQuickLy);
export default ChatRouter;