import express from "express";
import { addChat, getListChat, getListMessages, sendMessages } from "../controllers/ChatController.js";
import { removeCurrentTenant, updateTenant } from "../controllers/HomeController.js";
import { addComment, removeComment, updateComment } from "../controllers/commentController.js";







const TestRouter = express.Router(); 


TestRouter.put('/home/update/current-tenant',removeCurrentTenant);

export default TestRouter;