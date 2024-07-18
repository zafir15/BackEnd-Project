import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

 const connectDB= async()=>{
try{
   const ConnectionMongo =await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`Mongo DB DATABSE HOST : ${ConnectionMongo.connection.host}`);
}catch{(error)=>{
        console.log("Error in Connection", error);
        throw error;
        process.exit(1);
}}
}

export default connectDB;
