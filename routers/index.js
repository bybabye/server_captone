// routes.js
import express from 'express';
import OpenRouter from './OpenRouter.js';

import ChatRouter from './ChatRouter.js';
import UserRouter from './UserRouter.js';
import HomeRouter from './HomeRouter.js';
import CommentRouter from './CommentRouter.js';
import RentalRouter from './RentalRouter.js';
import NotificationRouter from './NotificationRouter.js';
import authorizationJWT from '../middleware/JWT.js';
import { authorizationAdmin } from '../middleware/admin.js';
import AdminRouter from './AdminRouter.js';
import { authorizationBlock } from '../middleware/block.js';

const router = express.Router();

router.use("/", OpenRouter);
router.use("/", authorizationJWT);
//router.use("/", authorizationBlock);
router.use("/", UserRouter);
router.use("/", ChatRouter);
router.use("/", HomeRouter);
router.use("/", CommentRouter);
router.use("/", RentalRouter);
router.use("/", NotificationRouter);
router.use('/',authorizationAdmin)
router.use('/',AdminRouter)
export default router;
