import express from "express";

import { changeUserUpHost, updateUser,getUser } from "../controllers/UserController.js";





const UserRouter = express.Router(); 

UserRouter.post('/user/login',getUser);
UserRouter.post('/user/update',updateUser);
UserRouter.post('/user/update/host',changeUserUpHost)
export default UserRouter;