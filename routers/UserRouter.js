import express from "express";

import { updateUser } from "../controllers/UserController.js";





const UserRouter = express.Router(); 


 UserRouter.post('/user/update',updateUser);
export default UserRouter;