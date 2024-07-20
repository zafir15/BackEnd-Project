import { User } from "../models/user.models";
import { APiError } from "../utils/ApiErrors";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"



export const verifyJWT = asyncHandler(async(req,res,next)=>{

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    
        if (!token) {
            throw new APiError(401,"Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token ,  process.env.ACCESS_TOKEN_SECRET )
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user){
            throw new APiError(401 , "Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new APiError(401,error?.message || "Invalid  Access Token")
    }

})