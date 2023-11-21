import express from "express";


import { listUser } from "../controllers/UserController.js";
import { blockUser, findUsersByPartialUsername, listReport } from "../controllers/AdminController.js";





const AdminRouter = express.Router(); 

AdminRouter.get('/admin/list/user',listUser);
AdminRouter.patch('/admin/block/user',blockUser);
AdminRouter.get('/admin/user/search/:partialUsername',findUsersByPartialUsername)
AdminRouter.get('/admin/list/report',listReport)
export default AdminRouter;