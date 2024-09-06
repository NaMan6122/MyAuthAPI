import { app } from './app.js';
import dotenv from "dotenv";
import connectDB from "./dbConfig/dbConfig.js";

dotenv.config({
    path: "./.env",
});

connectDB()
.then(() => {
    app.on(process.env.PORT, (error) => {
        console.log("Server config error!!", error);
        throw error;
    });
    app.listen(process.env.PORT, () => {
        console.log("Server is running on Port:", process.env.PORT || 4500);
    });
})
.catch((error) => {
    console.log("Cannot Configure Server!!", error);
});
