import { response } from "express";
import { asynchandler } from "../utils/asynchandler.js";
import { apiError } from "../utils/apierror.js";
import { User } from "../models/user.model.js"


const registerUser = asynchandler( async (req,res) => {
    //get usser details from frontend
    //validation - not empty 
    //check if user already exists : ussername,email
    //are there any files , avatar is required
    //upload them to cloudinary (we have to take out url) check for avatar
    //create user object - create entry in db
    //remove pwd and the refresh token field from response
    //check for user creation
    //return res

    const{fullname,email,username,password} = req.body
    console.log("email:",email);

    // if(fullname === ""){
    //     throw new apiError(400,"Full name is required")
    // }

    if(
        [fullname,email,username,password].some((field)=>field?.trim() === "")
    ){
        throw new apiError(400,"All the fields are required")
    }

    //findone return the first find of the search 
    const existeduser = User.findOne({
        $or:[{ username },{ email }]
    })
    
    if(existeduser){
        throw new apiError(409 , "User with email or username exists")
    }
    //we use 0 means first property because we get some file wale funcationalities in it

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;


    if(!avatarLocalPath){
        throw new apiError(400,"Avatar file is required")
    }

    if(!avatarLocalPath){
        
    }
})

export {registerUser}