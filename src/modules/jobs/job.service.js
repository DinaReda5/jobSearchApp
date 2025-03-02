import applicationModel from "../../DB/models/application.model.js";
import companyModel from "../../DB/models/company.model.js"
import jobModel from "../../DB/models/job.model.js";
import userModel from "../../DB/models/user.model.js";
import cloudinary from "../../utilits/cloudinary/index.js";
import { asyncHandler, eventEmitter } from "../../utilits/index.js"

// ------------------------------addJop----------------------------------
export const addJop = asyncHandler(async (req, res, next) => {
  const company =await companyModel.findById({ _id: req.body.companyId ,deletedAt: {$exists:false}})
    if (!company) {
      return next(new Error("company not exist or deleted", { cause: 404 }));
    }
    if (!company.HRs.includes(req.user._id) || !company.CreatedBy.toString()==req.user._id) {
      return next(new Error("you are not allowed to add jop in this company", { cause: 404 }));
    }
  const jop = await jobModel.create({...req.body,addedBy:req.user._id})
  return res.status(200).json({msg:"done",jop})
})
// ------------------------------updateJop----------------------------------
export const updateJop = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const job = await jobModel.findById({ _id: id, closed: false })
  if (!job) {
    return next(new Error("job not exist or deleted", { cause: 404 }));
  }
  const company = await companyModel.findOne({_id:job.companyId,deletedAt: {$exists:false}})
  if (!company) {
    return next(new Error("company not found", { cause: 404 })); 
  }
  
  if (company.CreatedBy.toString() === req.user._id.toString()) {
    const updatedJob = await jobModel.findByIdAndUpdate({_id:id},req.body,{new:true})
    return res.status(200).json({msg:"done",updatedJob})
  } else {
    return next(new Error("you are not authorized", { cause: 404 })); 
  }

})
// ------------------------------deleteJop----------------------------------
export const deleteJop = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const job = await jobModel.findById({ _id: id, closed: false })
  if (!job) {
    return next(new Error("job not exist or deleted", { cause: 404 }));
  }
  const company = await companyModel.findOne({_id:job.companyId,deletedAt: {$exists:false}})
  if (!company) {
    return next(new Error("company not found", { cause: 404 })); 
  }
  if (company.HRs.includes(req.user._id)) {
    await jobModel.updateOne({_id:id},{closed:true})
    return res.status(200).json({msg:"done"})
  } else {
    return next(new Error("you are not authorized", { cause: 404 })); 
  }

})
// ------------------------------jobs----------------------------------
export const jobs = asyncHandler(async (req, res, next) => {
  const { jobId, companyName } = req.params;
  console.log(companyName);
  
  if (jobId) { 
    const company = await companyModel.findOne({ companyName, deletedAt: { $exists: false } })
    if (!company) {
    return next(new Error("company not exist or deleted", { cause: 404 }));
    }
    const job = await jobModel.find({_id:jobId,companyId:company._id}).skip(0).limit(5).sort({ ["createdAt"]: 1 }); 
      return res.status(200).json({msg:"donee",job})
  }
  
  const jobs = await jobModel.find({}).skip(1).limit(5).sort({ ["createdAt"]: 1 }); 
  return res.status(200).json({msg:"done",jobs})
})
// ------------------------------matchjobs----------------------------------
export const matchjobs = asyncHandler(async (req, res, next) => {
  const { workingTime , jobLocation , seniorityLevel, jobTitle,technicalSkills } = req.query;
  if (req.params) { 
     let filter = {};

  if (workingTime) {
    filter.workingTime = workingTime;
  }
  if (jobLocation) {
    filter.jobLocation = jobLocation;
  }
  if (seniorityLevel) {
    filter.seniorityLevel = seniorityLevel;
  }
  if (jobTitle) {
    filter.jobTitle = jobTitle; 
  }
  if (technicalSkills) {
    filter.technicalSkills = technicalSkills ; 
  }
    const job = await jobModel.find(filter).skip(0).limit(5).sort({ ["createdAt"]: 1 }); 
      return res.status(200).json({msg:"donee",job})
  }
  
  const jobs = await jobModel.find({}).skip(1).limit(5).sort({ ["createdAt"]: 1 }); 
  return res.status(200).json({msg:"done",jobs})
})
// 6. Get all applications for specific Job.
//     - use virtual populate
//     - Each company Owner or company hr can take a look at the applications
//     - use pagination (skip , limit , sort (ex. by createdAt) and total count )
//     - Return each application with the user data, not the userId
// ------------------------------applyToJob----------------------------------
export const applyToJob = asyncHandler(async (req, res, next) => {
  const { jobId } = req.body;
  const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,{
    folder: "jopSearch-app/application",}
  );
  const newApplication = await applicationModel.create({ ...req.body, userCV: { secure_url, public_id } ,userId:req.user._id})
  
  // io.emit('newApplication', { jobId, userId });
  res.status(201).json({ msg: 'done',newApplication })
})
// ------------------------------applyStatus----------------------------------
export const applyStatus = asyncHandler(async (req, res, next) => {
  const { status, applicationId } = req.body;
  const application = await applicationModel.findById(applicationId)
  if (!application) {
    return next(new Error("apllication doesn't exists", { cause: 409 }));
  }
   //check email
   const emailExist = await userModel.findOne({ _id:application.userId });
   if (!emailExist) {
     return next(new Error("user not found", { cause: 404 }));
   }
  if (status=="rejected") {
    await applicationModel.updateOne({ _id: applicationId }, { status: "rejected" })
    eventEmitter.emit("reject", { email:emailExist.email });
  }
  if (status=="accepted") {
    await applicationModel.updateOne({ _id: applicationId }, { status: "accepted" })
    eventEmitter.emit("accept", { email:emailExist.email });
  }
  return res.status(201).json({ msg: "done"});
});