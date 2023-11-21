import express from "express";

import { addHome, deleteHome, removeCurrentTenant, updateTenant } from "../controllers/HomeController.js";





const HomeRouter = express.Router(); 

HomeRouter.post('/home/add',addHome);
HomeRouter.delete('/home/delete/:postId',deleteHome)
HomeRouter.patch('/home/update/tenant',updateTenant);
HomeRouter.patch('/home/update/current-tenant',removeCurrentTenant);
// HomeRouter.get('/home/add/quickly',addQuickLy);
export default HomeRouter;