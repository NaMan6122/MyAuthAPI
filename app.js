import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use(express.json({
    limit: "10mb",
}));

app.use(express.urlencoded({
    extended: true,
}));

//handling major routing, and directing the request to the respective route handler.
import userRouter from "./routes/user.route.js";
app.use("/api/v1/users", userRouter);

export { app };