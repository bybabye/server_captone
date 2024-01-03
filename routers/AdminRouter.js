import express from "express";


import { listUser } from "../controllers/UserController.js";
import { blockUser, deletedPostFromReport, findUsersByPartialUsername, getReportForId, informationUser, listReport, skipReportForId, unBlockUser } from "../controllers/AdminController.js";





const AdminRouter = express.Router(); 

AdminRouter.get('/admin/list/user',listUser);
AdminRouter.patch('/admin/block/user/:id',blockUser);
AdminRouter.patch('/admin/unBlock/user/:id',unBlockUser);
AdminRouter.get('/admin/user/search/:partialUsername',findUsersByPartialUsername)
AdminRouter.get('/admin/list/report',listReport)
AdminRouter.get('/admin/report',getReportForId)
AdminRouter.get('/admin/infomation',informationUser)
AdminRouter.patch('/admin/skipped/report',skipReportForId)
AdminRouter.delete('/admin/deleted/report',deletedPostFromReport)
export default AdminRouter;