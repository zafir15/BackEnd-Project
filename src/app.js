import express, { response } from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    Credential : true
}))

app.use(cookieParser());
app.use(response.json({limit:"16kb"}));
app.use(express.static("public"));
app.use(express.urlencoded({extended:true , limit:"16kb"}));

