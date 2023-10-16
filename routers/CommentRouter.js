import { addComment, removeComment, updateComment } from "../controllers/commentController.js";
import express from "express";


const CommentRouter = express.Router(); 

CommentRouter.post('/home/comment/add',addComment);
CommentRouter.patch('/home/comment/update',updateComment);
CommentRouter.delete('/home/comment/delete',removeComment);


export default CommentRouter;