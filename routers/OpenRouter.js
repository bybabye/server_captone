import express from "express";
import { addUser} from "../controllers/UserController.js";
import { address } from "../google_maps/googleMaps.js";
import { homeForId, listHome, searchHomeForAddress } from "../controllers/HomeController.js";





const OpenRouter = express.Router(); 

OpenRouter.post('/user/add',addUser);
OpenRouter.get('/home/list',listHome);
OpenRouter.get('/home',homeForId);
OpenRouter.get('/home/search',searchHomeForAddress);
// OpenRouter.get('/map',address);
export default OpenRouter;