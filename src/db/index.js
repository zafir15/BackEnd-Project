import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const ConnectionMongo = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`Mongo DB DATABASE HOST: ${ConnectionMongo.connection.host}`);
    } catch (e) {
        console.log("Error in Connection", e);
        process.exit(1);
    }
};

export default connectDB;
