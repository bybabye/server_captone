import express from "express";

import { addHome, deleteHome, removeCurrentTenant, updateTenant } from "../controllers/HomeController.js";
import { uploadFile } from "../google_apis/connect.js";

import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



const HomeRouter = express.Router(); 

HomeRouter.post('/home/add',addHome);
HomeRouter.delete('/home/delete/:postId',deleteHome)
HomeRouter.patch('/home/update/tenant',updateTenant);
HomeRouter.patch('/home/update/current-tenant',removeCurrentTenant);
HomeRouter.post('/upload',upload.single('image'),uploadFile)
// HomeRouter.get('/home/add/quickly',addQuickLy);
export default HomeRouter;