import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req,res) => {
    
 
    // get user details from frontend
    const {fullname,email,username,password} = req.body
    console.log("email", email)

    // validation - not empty
    if(
        [fullname,email,username,password].some((field) => {
            (field?.trim() === "" )
        }) // or done  by checking one on one
    ){
        throw new ApiError(400,"All fields are required")
    }

    // check if user is already exist - username , email


     const existedUser = User.findOne({
        $or : [{username}, {email}]
    })

    if(existedUser){
        throw new ApiError(409,"User with email or userName already exist")
    }
    // check for image/avatar

    const avatarPath = req.files?.avatar[0]?.path;
    const coverImagePath = req.files?.coverImage[0]?.path;

    if(!avatarPath){
        throw new ApiError(400, "Avatar image is required")
    }

    // uplode them to cloudinary

    const avatar = await uploadOnCloudinary(avatarPath)
    const coverImage = await uploadOnCloudinary(coverImagePath)

    if(!avatar){
        throw new ApiError(400, "Avatar image is required")
    }

    // create an obj - create entry in db

    const user = await User.create({
        fullname,
        avatar : avatar.url,
        coverImage : coverImage?.url || "",
        email,
        password,
        username : username.toLowerCase()
    })


    // remove password and refresh token field from response

    const createdUser = await User.findById(user._id).select (
        "-password -refreshToken"
    )


    // check for use creation

    if(!createdUser){
        throw new ApiError(500, "Somthing went wrong while creating user ")
    }
    // return res

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
    )
});

export {registerUser};