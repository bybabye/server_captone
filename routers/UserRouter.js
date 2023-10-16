import express from "express";

import { changeUserUpHost, updateUser,getUser } from "../controllers/UserController.js";





const UserRouter = express.Router(); 

UserRouter.post('/user/login',getUser);
UserRouter.patch('/user/update',updateUser);
UserRouter.patch('/user/update/host',changeUserUpHost)
export default UserRouter;