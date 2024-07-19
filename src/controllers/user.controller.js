import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { APiError } from "../utils/ApiErrors.js";
import {User} from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
     const{fullName , userName ,password , email}= req.body
     console.log(fullName , userName ,password , email)

     if ([fullName , userName ,password , email].some((field)=>
        field?.trim()==="")) {
        throw new APiError(400 ,"All feilds are Required");
     }
     
     const existedUser = await User.findOne({
        $or:[{userName},{email}]
     })

     if(existedUser){
        throw new APiError(404 , "Username or Email Already Existed");
     }

     const avatarLocalPath = req.files?.avatar[0]?.path;
     const coverImageLocalPath = req.files?.coverImage[0]?.path;
     
     if (!avatarLocalPath) {
        throw new APiError(400 , "Avatar is Required");
     }

     const avatar = await uploadOnCloudinary(avatarLocalPath);
     const coverImage = await uploadOnCloudinary(coverImageLocalPath);

     if (!avatar) {
        throw new APiError(400 ,"Avatar file is Required");
     }

     const user = await User.create({
            fullName,
            avatar:avatar.url,
            coverImage:coverImage?.url || "",
            email,
            password,
            userName:userName.toLowerCase()
     })
     
     const createdUser = await User.findById(user._id).select("-password -refreshTokens")

     if(!createdUser){
        throw new APiError(505 , "Something went wrong while registering the user")
     }

    
     return res.status(201).json(
          new ApiResponse(200 , createdUser , "User registered Successfully")
     )
});

export { registerUser };
