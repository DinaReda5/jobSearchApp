import joi from "joi";
import { generalRules } from "../../utilits/index.js";

export const banUserSchema = joi.object({
    id: generalRules.ObjectId.required(),
    AdminId:generalRules.ObjectId.required(),
})
