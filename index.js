import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import axios from "axios";
import cheerio from "cheerio";
import "dotenv/config.js";
import { getAuth } from "firebase-admin/auth";
import "./firebaseConfig.js";
import OpenRouter from "./routers/OpenRouter.js";
import HomeRouter from "./routers/HomeRouter.js";
import fs from "fs";

import UserRouter from "./routers/UserRouter.js";
// Kết nối MongoDB bằng URI được đặt trong tệp .env
const URI = `mongodb+srv://luxi291000:${process.env.DB_PASSWORD}@cluster0.i92x06q.mongodb.net/?retryWrites=true&w=majority`;
const URL = `https://nhatro.duytan.edu.vn/nha-tro/tim-phong-tro/phong-tro-/416?page=2&geoid1=33`;
// Tạo một ứng dụng Express
const app = express();

// Tạo một máy chủ HTTP sử dụng Express
const httpServer = http.createServer(app);
// Sử dụng middleware để xử lý CORS và phần thân yêu cầu HTTP
const authorizationJWT = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  
  if (authorizationHeader) {
    const accessToken = authorizationHeader.split(" ")[1];
    getAuth()
      .verifyIdToken(accessToken)
      .then((decodedToken) => {
        res.locals.uid = decodedToken.uid;
        next();
      })
      .catch((err) => {
        console.log({ err });
        return res.status(403).json({ message: "Forbidden", error: err });
      });
  } else {
     return res.status(401).json({ message: "Unauthorized" });
  }
};


// // Áp dụng middleware cho UserRouter
// UserRouter.use(authorizationJWT);

// // Áp dụng middleware cho HomeRouter
// HomeRouter.use(authorizationJWT);



app.use(cors(), bodyParser.json());
app.use("/", OpenRouter);
app.use("/",authorizationJWT)
app.use("/", UserRouter);
app.use("/", HomeRouter);




// Cấu hình kết nối với MongoDB bằng Mongoose

mongoose.set("strictQuery", false);
mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to DB"); // Kết nối thành công với MongoDB
    await new Promise((resolvers) =>
      httpServer.listen({ port: process.env.PORT || 4000, resolvers })
    );
  });
