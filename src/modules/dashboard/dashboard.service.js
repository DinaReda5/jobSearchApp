

// 4. Approve company  (2 Grade)

import companyModel from "../../DB/models/company.model.js";
import userModel from "../../DB/models/user.model.js";
import { asyncHandler } from "../../utilits/index.js";

// ------------------------------banUser----------------------------------
export const banUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { AdminId } = req.body;
    const admin = await userModel.findOne({ _id: AdminId, role:"Admin",deletedAt: { $exists: false } })
    if (!admin) {
        return next(new Error("admin not found", { cause: 404 }));
    }
    const user = await userModel.findOne({ _id: id, deletedAt: { $exists: false } })
    if (!user) {
        return next(new Error("user not found", { cause: 404 }));
    }
    if (user?.bannedAt) {
        await userModel.findOneAndUpdate({ _id: id }, { $unset: { bannedAt: 0 } }, { new: true })
        return res.status(200).json({msg:"unbanned"})
    }
    await userModel.findOneAndUpdate({ _id: id }, {  bannedAt: Date.now()}, { new: true })
    return res.status(200).json({msg:"banned"})
})
// ------------------------------banCompany----------------------------------
export const banCompany = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { AdminId } = req.body;
    const admin = await userModel.findOne({ _id: AdminId,role:"Admin", deletedAt: { $exists: false } })
    if (!admin) {
        return next(new Error("admin not found", { cause: 404 }));
    }
    const company = await companyModel.findOne({ _id: id, deletedAt: { $exists: false } })
    if (!company) {
        return next(new Error("company not found", { cause: 404 }));
    }
    if (company?.bannedAt) {
        await companyModel.findOneAndUpdate({ _id: id }, { $unset: { bannedAt: 0 } }, { new: true })
        return res.status(200).json({msg:"unbanned"})
    }
    await companyModel.findOneAndUpdate({ _id: id }, {  bannedAt: Date.now()}, { new: true })
    return res.status(200).json({msg:"banned"})
})
// ------------------------------approveCompany----------------------------------
export const approveCompany = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { AdminId } = req.body;
    const admin = await userModel.findOne({ _id: AdminId,role:"Admin", deletedAt: { $exists: false } })
    if (!admin) {
        return next(new Error("admin not found", { cause: 404 }));
    }
    const company = await companyModel.findOne({ _id: id, deletedAt: { $exists: false },bannedAt:{ $exists: false } })
    if (!company) {
        return next(new Error("company not found", { cause: 404 }));
    }
    await companyModel.findOneAndUpdate({ _id: id }, { approvedByAdmin:true }, { new: true })
    return res.status(200).json({msg:"done"})
  })