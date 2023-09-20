import express from "express";
import { addUser, getUser} from "../controllers/UserController.js";
import { address } from "../google_maps/googleMaps.js";
import { listHome } from "../controllers/HomeController.js";





const OpenRouter = express.Router(); 

OpenRouter.post('/user/add',addUser);
OpenRouter.post('/user/login',getUser);
OpenRouter.get('/home/list',listHome);
// OpenRouter.get('/map',address);
export default OpenRouter;