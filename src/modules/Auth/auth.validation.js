import joi from "joi";
import { generalRules } from "../../utilits/generalRules/index.js"

export const signUpSchema =  joi.object({
    firstName: joi.string().alphanum().required(),
    lastName: joi.string().alphanum().required(),
    email:generalRules.email.required(),
    password: generalRules.password.required(),
    gender: joi.string().valid("Male", "Female"),
    DOB:joi.date().required(),
    mobileNumber: joi.string().regex(/^01[0125][0-9]{8}$/).required(),
    role: joi.string().valid("User", "Admin"),
}).required()

export const confirmOTPSchema =  joi.object({
    email:generalRules.email.required(),
    code: joi.string().length(4).required()
}).required()

export const signInSchema =  joi.object({
    email:generalRules.email.required(),
    password: generalRules.password.required()
}).required()


export const forgetPasswordSchema =  joi.object({
    email:generalRules.email.required(),
}).required()

export const resetPasswordSchema =  joi.object({
    email:generalRules.email.required(),
    code: joi.string().length(4).required(),
    newPassword: generalRules.password.required(),
}).required()

export const refreshTokenSchema =  joi.object({
    authorization:joi.string().required()  
}).required()