import userModel from "../../DB/models/user.model.js";
import { accessRoles } from "../../middleware/auth.js";
import cloudinary from "../../utilits/cloudinary/index.js";
import { asyncHandler, Compare, decrypt, encrypt, Hash } from "../../utilits/index.js";

// ------------------------------updateAccount----------------------------------
export const updateAccount = asyncHandler(async (req, res, next) => {
  if (req.body.mobileNumber) {
    req.body.mobileNumber = await encrypt({
      key: req.body.mobileNumber,
      SIGNATURE: process.env.SIGNATURE,
    });
  }
  const user = await userModel.findByIdAndUpdate(
    { _id: req.user._id },
    req.body,
    { new: true }
  );
  return res.status(201).json({ msg: "done", user });
});
// ------------------------------accountData----------------------------------
export const accountData = asyncHandler(async (req, res, next) => {
 const mobileNumber = await decrypt({key:req.user.mobileNumber,SIGNATURE:process.env.SIGNATURE})
  return res.status(201).json({ msg: "done", user:{firstName:req.user.firstName,lastName:req.user.lastName,email:req.user.email,mobileNumber}});
});
// ------------------------------shareProfile----------------------------------
export const shareProfile = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await userModel.findOne({ _id: id, deletedAt: {$exists:false} });
  if (!user) {
    return next(new Error("email not exist or deleted", { cause: 404 }));
  }
  if (req.user._id.toString() === id) {
    return res.status(200).json({msg:"done",user:req.user})
  }
 const mobileNumber = await decrypt({key:user.mobileNumber,SIGNATURE:process.env.SIGNATURE})
  return res.status(201).json({ msg: "done", user:{username:user.username,mobileNumber,profilePic:user.profilePic.secure_url, coverPic:user.coverPic.secure_url}});
});
// ------------------------------updatePassword----------------------------------
export const updatePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  if (!(await Compare({ key: oldPassword, hashed: req.user.password }))) {
    return next(new Error("invalid old password", { cause: 400 }));
  }
  const hash = await Hash({
    key: newPassword,
    SALT_ROUNDS: process.env.SALT_ROUNDS,
  });
  const user = await userModel.findByIdAndUpdate(
    { _id: req.user._id },
    { password: hash, changeCredentialTime: Date.now() },
    { new: true }
  );
  return res.status(201).json({ msg: "done", user });
});
// ------------------------------UploadProfilePic----------------------------------
export const UploadProfilePic = asyncHandler(async (req, res, next) => {
  const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,{
      folder: "jopSearch-app/user",}
  );
req.body.profilePic={ secure_url, public_id }
  const user = await userModel.findByIdAndUpdate({_id:req.user._id},req.body,{new:true})
  return res.status(200).json({ msg: "done",user});
});
// ------------------------------UploadCoverPic----------------------------------
export const UploadCoverPic = asyncHandler(async (req, res, next) => {
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,{
        folder: "jopSearch-app/user",}
    );
  req.body.coverPic={ secure_url, public_id }
    const user = await userModel.findByIdAndUpdate({_id:req.user._id},req.body,{new:true})
    return res.status(200).json({ msg: "done",user});
});
// ------------------------------DeleteProfilePic----------------------------------
export const DeleteProfilePic = asyncHandler(async (req, res, next) => {
  await cloudinary.uploader.destroy(req.user.profilePic.public_id)
  const user= await userModel.findByIdAndUpdate({_id:req.user._id},{$unset:{profilePic:0}},{new:true})
  return res.status(201).json({ msg: "done",user});
});
// ------------------------------DeleteCoverPic----------------------------------
export const DeleteCoverPic = asyncHandler(async (req, res, next) => {
  await cloudinary.uploader.destroy(req.user.coverPic.public_id)
  const user= await userModel.findByIdAndUpdate({_id:req.user._id},{$unset:{coverPic:0}},{new:true})
  return res.status(201).json({ msg: "done",user});
});
// ------------------------------softDelete----------------------------------
export const softDelete = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!req.user.role == "Admin") {
    return next(new Error("not authorized", { cause: 404 }));
   
  }
  const user = await userModel.findOneAndUpdate({ _id: id, deletedAt: {$exists:false} },{deletedAt:Date.now()},{new:true});
  return res.status(201).json({ msg: "done", user});
});
