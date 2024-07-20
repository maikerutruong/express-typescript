import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/mongoose";
import userRouter from "./routes/user.route";
import taskRouter from "./routes/task.route";
import exchangeRouter from "./routes/exchange.route";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(userRouter);
app.use(taskRouter);
app.use(exchangeRouter);

export default app;
