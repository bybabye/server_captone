import express from "express";

import { addHome, addQuickLy, deleteHome } from "../controllers/HomeController.js";





const HomeRouter = express.Router(); 

HomeRouter.post('/home/add',addHome);
HomeRouter.get('/home/delete',deleteHome);
// HomeRouter.get('/home/add/quickly',addQuickLy);
export default HomeRouter;