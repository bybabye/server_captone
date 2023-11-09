import express from "express";

import { addNotification, listNotification, readNotificationForId } from "../controllers/NotificationController.js";

const NotificationRouter = express.Router(); 

NotificationRouter.post('/notification/add',addNotification);
NotificationRouter.get('/notification/list',listNotification);
NotificationRouter.patch('/notification/read',readNotificationForId)
export default NotificationRouter;