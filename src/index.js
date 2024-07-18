import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({ path: "./env"});

connectDB().then((res)=>{

    app.listen(`${process.env.PORT} Server is Listening`)
}).catch((err)=>{
   console.log(err)
});
