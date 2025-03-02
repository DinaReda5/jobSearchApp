import joi from "joi";
import { generalRules } from "../../utilits/index.js";

export const updateAccountSchema =  joi.object({
    firstName: joi.string().alphanum(),
    lastName: joi.string().alphanum(),
    gender: joi.string().valid("Male", "Female"),
    mobileNumber: joi.string().regex(/^01[0125][0-9]{8}$/),
    DOB:joi.date()
}).required()

export const updatePasswordSchema =  joi.object({
    oldPassword: generalRules.password.required(),
    newPassword: generalRules.password.required(),
})
export const UploadProfilePicSchema =  joi.object({
    file: generalRules.file,
}).required()
export const UploadCoverPicSchema =  joi.object({
    file: generalRules.file,
}).required()

export const shareProfileSchema =  joi.object({
    id:generalRules.ObjectId.required()
})