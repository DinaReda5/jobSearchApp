import joi from "joi";
import { generalRules } from "../../utilits/index.js";

export const addCompanySchema = joi.object({
    companyName: joi.string().min(3).required(),
    description: joi.string().min(3).required(),
    industry: joi.string().required(),
    address: joi.string().required(),
    numberOfEmployees: joi.string().required(),
    companyEmail: generalRules.email.required(),
    CreatedBy: generalRules.ObjectId.required(),
    HRs: generalRules.ObjectId.required(),
    file:generalRules.file
})
export const updateCompanySchema = joi.object({
    companyName: joi.string().min(3),
    description: joi.string().min(3),
    industry: joi.string(),
    address: joi.string(),
    numberOfEmployees: joi.string(),
    companyEmail: generalRules.email,
    CreatedBy: generalRules.ObjectId,
    HRs: generalRules.ObjectId,
    id:generalRules.ObjectId.required()
})
export const companySearchSchema = joi.object({
    companyName: joi.string().min(3).required(),
})
export const uploadCompanyLogoSchema = joi.object({
    id:generalRules.ObjectId.required(),
    file:generalRules.file
})
export const DeleteCompanyLogoSchema = joi.object({
    id:generalRules.ObjectId.required(),
})