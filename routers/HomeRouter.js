import express from "express";

import { addHome, deleteHome, removeCurrentTenant, updateTenant } from "../controllers/HomeController.js";
import { uploadFiles } from "../google_apis/connect.js";

import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer().array('images' , 5);



const HomeRouter = express.Router(); 

HomeRouter.post('/home/add',addHome);
HomeRouter.delete('/home/delete/:postId',deleteHome)
HomeRouter.patch('/home/update/tenant',updateTenant);
HomeRouter.patch('/home/update/current-tenant',removeCurrentTenant);
HomeRouter.post('/upload',upload,uploadFiles)
// HomeRouter.get('/home/add/quickly',addQuickLy);
export default HomeRouter;