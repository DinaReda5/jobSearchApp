import companyModel from "../../DB/models/company.model.js";
import cloudinary from "../../utilits/cloudinary/index.js";
import { asyncHandler } from "../../utilits/index.js";

// ------------------------------addCompany----------------------------------
export const addCompany = asyncHandler(async (req, res, next) => {
      const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,{
          folder: "jopSearch-app/company",}
      );
    req.body.legalAttachment={ secure_url, public_id }
    let HR = []
    HR.push(req.body.HRs)
    const company = await companyModel.create({...req.body,HRs:HR,CreatedBy:req.user._id})
    return res.status(200).json({msg:"done",company})
})
// ------------------------------updateCompany----------------------------------
export const updateCompany = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const company = await companyModel.findOne({ _id: id,CreatedBy:req.user._id, deletedAt: { $exists: false } })
    console.log(company);
    if (!company) {
        return next(new Error("company doesn't exists or you are not allowed update company", { cause: 409 }));
    }
    const data = await companyModel.findByIdAndUpdate(
      { _id: id },
      req.body,
      { new: true }
    );
    return res.status(201).json({ msg: "done",data });
});
// ------------------------------softDelete----------------------------------
export const softDelete = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const company = await companyModel.findOne({_id:id, deletedAt: {$exists:false}})
  if (!req.user.role == "Admin" || !company.CreatedBy == req.user._id) {
    return next(new Error("not authorized", { cause: 404 }));
  }
  const deletedCompany = await companyModel.findOneAndUpdate({ _id: id},{deletedAt:Date.now()},{new:true});
  return res.status(201).json({ msg: "done",deletedCompany});
});
// 4. Get specific company with related jobs. (2 Grades)
//     - Send the companyId
//     - Return all jobs related to this company using virtual populate
// ------------------------------companySearch----------------------------------
export const companySearch = asyncHandler(async (req, res, next) => {
    const { companyName } = req.params;
    const company = await companyModel.findOne({ companyName, deletedAt: { $exists: false }  }).populate({
        path: "CreatedBy",
        select:"firstName lastName email"
  })
    if (!company) {
      return next(new Error("company not exist or deleted", { cause: 404 }));
    } 
   return res.status(201).json({ msg: "done",company});
});
// ------------------------------uploadCompanyLogo----------------------------------
export const uploadCompanyLogo = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const company = await companyModel.findOne({ _id: id, CreatedBy: req.user._id, deletedAt: { $exists: false } })
    if (!company) {
        return next(new Error("company doesn't exists or you are not allowed update company", { cause: 409 }));
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,{
        folder: "jopSearch-app/company",}
    );
    req.body.Logo={ secure_url, public_id }
    const updatedCompany = await companyModel.findByIdAndUpdate({_id:id},req.body,{new:true})
    return res.status(200).json({ msg: "done",updatedCompany});
  });
// ------------------------------uploadCompanyCover----------------------------------
  export const uploadCompanyCover = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const company = await companyModel.findOne({ _id: id, CreatedBy: req.user._id, deletedAt: { $exists: false } })
    if (!company) {
        return next(new Error("company doesn't exists or you are not allowed update company", { cause: 409 }));
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,{
        folder: "jopSearch-app/company",}
    );
    req.body.coverPic={ secure_url, public_id }
    const updatedCompany = await companyModel.findByIdAndUpdate({_id:id},req.body,{new:true})
    return res.status(200).json({ msg: "done",updatedCompany});
  });
// ------------------------------DeleteCompanyLogo----------------------------------
export const DeleteCompanyLogo = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const company = await companyModel.findOne({ _id: id, CreatedBy: req.user._id, deletedAt: { $exists: false } })
    if (!company) {
        return next(new Error("company doesn't exists or you are not allowed update company", { cause: 409 }));
    }
    await cloudinary.uploader.destroy(company.Logo.public_id)
    const updatedCompany= await companyModel.findByIdAndUpdate({_id:id},{$unset:{Logo:0}},{new:true})
    return res.status(201).json({ msg: "done",updatedCompany});
  });
  // ------------------------------DeleteCompanyCoverPic----------------------------------
export const DeleteCompanyCoverPic = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const company = await companyModel.findOne({ _id: id, CreatedBy: req.user._id, deletedAt: { $exists: false } })
    if (!company) {
        return next(new Error("company doesn't exists or you are not allowed update company", { cause: 409 }));
    }
    await cloudinary.uploader.destroy(company.coverPic.public_id)
    const updatedCompany= await companyModel.findByIdAndUpdate({_id:id},{$unset:{coverPic:0}},{new:true})
    return res.status(201).json({ msg: "done",updatedCompany});
  });
