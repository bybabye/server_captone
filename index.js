import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import "dotenv/config.js";
import rateLimit from "express-rate-limit";
import router from "./routers/index.js";
// Kết nối MongoDB bằng URI được đặt trong tệp .env
const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.i92x06q.mongodb.net/?retryWrites=true&w=majority`;

// Tạo một ứng dụng Express
const app = express();

// Tạo một máy chủ HTTP sử dụng Express
const httpServer = http.createServer(app);

// đặt hạn chế request
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15phut
  max: 100,
  message: "Bạn đã vượt quá giới hạn tốc độ truy cập.",
});

// Routers
// Middleware
app.use(cors(), bodyParser.json(), limiter);
app.use("/", router);
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
