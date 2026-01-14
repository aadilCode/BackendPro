import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js"
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js"




const registerUser =  asyncHandler(async(req ,res ) => {
   // get user details from frontend 
  //  validate all fields of the user input
  // check if user already exist : username email..
  // check for images and check for avatar
  // upload them on cloudinary , avatar
  // create user object  - create entry in db
  //  remove password and refresh token field from response
  // check for  user  creation
  //  return res

  const { email, fullName, userName, password}  =  req.body
  console.log("email",email,"fullName",fullName,"password",password)


  

// if (
//     [fullName, email, username, password]. some( (field) =>
//     field ?. trim() === "")
// ){
//     throw new apiError(400,"All fields  are required ")
// }   


  if (fullName === "") {
    throw new apiError(400,"fullName is required ")
  }
 const existedUser  =  User.findOne({
    $or : [{userName},{email}]
  })

  if (existedUser) {
    throw apiError(409,"user with email or userName already exist")
  }


  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;


  if (!avatarLocalPath) {
    throw apiError(400,"you need an avatar please upload one")
  }

  const avatar =  await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if (!avatar) {
    throw new apiError(400,"your avatar is not available")
  }
  const user = await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    email,
    password, 
    userName : userName.toLowerCase()
  })
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )
  if (!createdUser) {
    throw new apiError(500, "something went wrong while registering the user")
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser,"user registered successfully")
  )


})

export { registerUser }