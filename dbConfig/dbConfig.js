import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const dbConfig = async function (){
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log("MongoDB Connected Successfully!!", connectionInstance.connection.host);
    } catch (error) {
        console.log("Cannot Connect to MongoDB!!", error.message);
        process.exit(1);
    }
}

export default dbConfig;
