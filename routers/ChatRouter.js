import express from "express";


import { addChat, getChat, getMessagesForChatId, sendMessages } from "../controllers/ChatController.js";





const ChatRouter = express.Router(); 

ChatRouter.post('/chat/add',addChat);
ChatRouter.get('/chat',getChat)
ChatRouter.post('/chat/messages/send',sendMessages);
ChatRouter.get('/chat/messages',getMessagesForChatId)
// HomeRouter.get('/home/add/quickly',addQuickLy);
export default ChatRouter;