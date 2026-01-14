import { asyncHandler } from "../utils/asyncHandler.js"

const registerUser =  asyncHandler(async(req ,res ) => {
    res.status(200).json({
        message:"This is coming from registeruser"
    })
})

export { registerUser }