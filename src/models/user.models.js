import mongoose , {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const userSchema = new Schema(
    {
        userName:{
            typeof:String,
            required :true,
            lowercase:true,
            trim:true,
            unique:true,
            index:true
        },
       email:{
            typeof:String,
            required :true,
            lowercase:true,
            trim:true,
            unique:true,
        },
       fullName:{
            typeof:String,
            required :true,
            trim:true,
            index:true
        },
        avatar:{
            type:String,
            required:true
        },
        coverImage:{
            type:String,
        },
        password:{
            type:String,
            required:[true , "Password Must be filled In"]
        },
        refreshTokens:{
            type:String,
            required:true
        },
        watchHistory:{
            type :Schema.Types.ObjectId,
            ref: "Video"
        }

    },{
        timestamps:true
    }
)

userSchema.pre("save", async function (next){
    if(!this.isModified(this.password)) return next();

    this.password = bcrypt.hash(this.password,10);
    next();
    
})

userSchema.methods.isPasswordCorrect = async function(password){

    return await bcrypt.compare(password , this.password);
}

userSchema.methods.generateAccessTokens = function(){
    jwt.sign(
        {
            _id : this.id ,
        email : this.email , 
        fullName : this.fullName,
        userName : this.userName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY,
        }

    )
}
userSchema.methods.generateRefreshTokens = function(){
    jwt.sign(
        {
            _id : this.id ,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}

export const User = mongoose.model("User",userSchema);