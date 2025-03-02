import joi from "joi";
import { generalRules } from "../../utilits/index.js";

export const addJopSchema = joi.object({
    jobTitle: joi.string().min(3).required(),
    jobLocation: joi.string().valid('onsite', 'remotely', 'hybrid').required(),
    workingTime: joi.string().valid('part-time', 'full-time').required(),
    seniorityLevel: joi.string().valid('fresh', 'Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO').required(),
    jobDescription: joi.string().min(3).required(),
    technicalSkills: joi.array().items(joi.string().required()).required(),
    softSkills: joi.array().items(joi.string().required()).required(),
    companyId:generalRules.ObjectId.required()
})
export const updateJopSchema = joi.object({
    jobTitle: joi.string().min(3),
    jobLocation: joi.string().valid('onsite', 'remotely', 'hybrid'),
    workingTime: joi.string().valid('part-time', 'full-time'),
    seniorityLevel: joi.string().valid('fresh', 'Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO'),
    jobDescription: joi.string().min(3),
    technicalSkills: joi.array().items(joi.string().required()),
    softSkills: joi.array().items(joi.string().required()),
    id:generalRules.ObjectId.required()
})
export const deleteJopSchema = joi.object({
    id:generalRules.ObjectId
}).required()
export const JopsSchema = joi.object({
    jobId: generalRules.ObjectId,
    companyName:joi.string().min(3),
})
export const matchjobsSchema = joi.object({
    jobTitle: joi.string().min(3),
    jobLocation: joi.string().valid('onsite', 'remotely', 'hybrid'),
    workingTime: joi.string().valid('part-time', 'full-time'),
    seniorityLevel: joi.string().valid('fresh', 'Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO'),
    technicalSkills: joi.array().items(joi.string().required()),
})
export const applyToJobSchema = joi.object({
    jobId:  generalRules.ObjectId.required(),
    userCV:generalRules.file
})
export const applyStatusSchema = joi.object({
    applicationId:  generalRules.ObjectId.required(),
    status:joi.string().valid('accepted', 'rejected').required(),
})