import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { APiError } from "../utils/ApiErrors.js";
import {User} from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessTokenAndRefreshToken = async(userId)=>{
    try {
        
        const user = await User.findById(userId)
        const accessToken = user.generateAccessTokens()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken

        await user.save({validateBeforeSave : false})

        return {accessToken , refreshToken}

    } catch (error) {
        throw new APiError(500 , "Something went wrong while generating access and refresh token")
    }
}

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
    //  const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.length >0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
     
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
     
     const createdUser = await User.findById(user._id).select("-password -refreshToken")

     if(!createdUser){
        throw new APiError(505 , "Something went wrong while registering the user")
     }

    
     return res.status(201).json(
          new ApiResponse(200 , createdUser , "User registered Successfully")
     )
});

const loginUser = asyncHandler(async(req, res)=>{
    
const {userName ,email ,password} = req.body
if (!(userName||email)) {
        throw APiError(400 , "UserName or Emil Shouldnot Be Empty")  
}  
    const user= await User.findOne({
        $or:[{userName} , {email}]
    })

    if (user) {

        throw new APiError(404 ,"User not Found")
        
    }

    const isPasswordValid = await user.isPasswordCorrect(password)


    if (!isPasswordValid) {
        throw new APiError(404 ,"Password not Correct")
        
    }

    const {accessToken , refreshToken} = generateAccessTokenAndRefreshToken(user._id)


    const loggedIn = await User.findOne(user._id).select("-password -refreshToken")

    const options = {
        httpOnly :true,
        secure:ture
    }

        return res
        .status(200).
        cooke("accessToken" , accessToken ,options)
        .cooke("refreshToken" , refreshToken ,options)
        .json(
            new ApiResponse(200 ,{
                user : loggedIn , accessToken , refreshToken
            },
            "User LoggedIn Successfully")
        )
})

const logoutUser = asyncHandler(async(req , res)=>{
   await User.findByIdAndUpdate(
        req.user._id,{
            $set:{
                refreshToken : undefined
            }
        },{

            new :true
        }
    )

    const options = {
        httpOnly :true,
        secure:ture
    }

    return res
    .status(200)
    .clearCookie("accessToken" , options)
    .clearCookie("refreshToken" , options)
    .json(new ApiResponse(200 , {} , "User Logged Out"))
})

export { registerUser , loginUser ,logoutUser};
 