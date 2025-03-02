import userModel from "../../DB/models/user.model.js";
import { asyncHandler, Compare, eventEmitter, generateToken, Hash, verifyToken } from "../../utilits/index.js";
import {OAuth2Client} from 'google-auth-library';
// ------------------------------signUp----------------------------------
export const signUp = asyncHandler(async (req, res, next) => {
  const {
    firstName,lastName,email,password,gender,DOB,mobileNumber,role,
  } = req.body;
  //check email
  const emailExist = await userModel.findOne({ email });
  if (emailExist) {
    return next(new Error("email already exists", { cause: 409 }));
  }
  //send DB
  const user = new userModel({
    firstName, lastName, email, password, gender, DOB,mobileNumber, role,
  });
  await user.save();
  //send email
  eventEmitter.emit("sendEmail", { email });
  return res.status(201).json({ msg: "done and check your email", user });
});
// ------------------------------confirmOTP----------------------------------
export const confirmOTP = asyncHandler(async (req, res, next) => {
  const { email, code } = req.body;
  //check email
  const user=await userModel.findOne({ email, isConfirmed:false })
  if (!user) {
    return next(new Error("email not exists or the user aready confirmed",{cause:404}))
  }
  // check OTP expire date
  if (user.OTP[0].expiresIn < new Date()) {
    return next(new Error("the otp code is expired or not exist any more",{cause:409}))
  }
  // check OTP type
  if (user.OTP[0].type == "forgetPassword") {
    return next(new Error("the otp type is not for confirm Email",{cause:409}))
  }
  // check otp value
  const match = await Compare({ key: code, hashed: user.OTP[0].code })
  if (!match) {
    return next(new Error("the code is not correct",{cause:400}))
  }
  //remove OTP
  await userModel.updateOne({email},{isConfirmed:true,$unset:{OTP:0}})
  return res.status(201).json({ msg: "done" });
});
// ------------------------------signIn----------------------------------
export const signIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  
  //check email
  const user=await userModel.findOne({ email, isConfirmed:true,provider:"system" })
  if (!user) {
    return next(new Error(
      "email not exists or the user not confirmed yet or login with google",
      { cause: 404 }
    ))}
  const match = await Compare({ key: password, hashed: user.password })
  if (!match) {
    return next(new Error("the password is not correct",{cause:400}))
  }
  const accessToken =await generateToken({
    payload: { email,id:user._id },
    SECRET_KEY: user.role == "User" ?
    process.env.ACCESS_SIGNATURE_USER : process.env.ACCESS_SIGNATURE_ADMIN,
    option:{expiresIn:"1h"}
  })
  const refreshToken = await generateToken({
    payload: { email ,id:user._id},
    SECRET_KEY: user.role == "User" ?
    process.env.REFRESH_SIGNATURE_USER : process.env.REFRESH_SIGNATURE_ADMIN,
    option:{expiresIn:"1w"}
  })
  return res.status(201).json({ msg: "done" ,accessToken,refreshToken});
});
// ------------------------------signupWithGmail----------------------------------
export const signupWithGmail = asyncHandler(async (req, res, next) => {
  const { idToken } = req.body;
  const client = new OAuth2Client();
  async function verify() {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.WEB_CLIENT_ID,  
    });
    const payload = ticket.getPayload();
    return payload;
  }
  const {given_name,family_name,email,email_verified,picture} = await verify()
  let user = await userModel.findOne({ email })
  if (user) {
    return next(new Error("user already exist please go to login",{ cause: 409 }))
  }
  user = await userModel.create({
    firstName:given_name,
    lastName:family_name,
    email,
    isConfirmed:email_verified,
    profilePic:{public_id:"",secure_url:picture},
    provider:"google"
  
})
    return res.status(201).json({ msg: "signed up with google successfully"});
});
// ------------------------------loginWithGmail----------------------------------
export const loginWithGmail = asyncHandler(async (req, res, next) => {
  const { idToken } = req.body;

  const client = new OAuth2Client();
  async function verify() {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.WEB_CLIENT_ID,  
    });
    const payload = ticket.getPayload();
    return payload;
  }
  const { email, email_verified, picture, name } = await verify()
  let user = await userModel.findOne({ email })
  if (!user) {
    return next(new Error("please signup with google first",{ cause: 404 }))
  }
  if (user.provider != "google") {
    return next(new Error("please login with in system",{ cause: 409 }))  
  }
  const accessToken =await generateToken({
    payload: { email,id:user._id },
    SECRET_KEY: user.role == "User" ?
      process.env.SECRET_KEY_USER : process.env.SECRET_KEY_ADMIN,
    option:{expiresIn:"1h"}
  })
  return res.status(201).json({ msg: "done" ,token:accessToken});
});
// ------------------------------forgetPassword----------------------------------
export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  //check email
  const user = await userModel.findOne({
    email
    // , isDeleted: false
  })
  if (!user) {
    return next(new Error("email not exists or the user not found",{cause:404}))
  }
  eventEmitter.emit("forgetPassword",{email})
  return res.status(201).json({ msg: "done"});
});
// ------------------------------resetPassword----------------------------------
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email ,code, newPassword} = req.body;
  //check email
  const user = await userModel.findOne({
    email
    // , isDeleted: false
  })
  if (!user) {
    return next(new Error("email not exists ",{cause:404}))
  }
  // check OTP expire date
  if (user.OTP[0]?.expiresIn < new Date()) {
    return next(new Error("the otp code is expired or not exist any more",{cause:409}))
  }
  // check OTP type
  if (user.OTP[0]?.type == "confirmEmail") {
    return next(new Error("the otp type is not for forget Password",{cause:409}))
  }
  // check otp value
  const match = await Compare({ key: code, hashed: user?.OTP[0]?.code ||""})
  if (!match) {
    return next(new Error("the code is not correct",{cause:400}))
  }
  //hash password
  const hash = await Hash({ key: newPassword, SALT_ROUNDS: process.env.SALT_ROUNDS })
   //update password
  await userModel.updateOne({ email }, {
    password: hash, isConfirmed: true
    , $unset: { OTP: 0 }
  })
  return res.status(201).json({ msg: "done"});
});
// 8. Refresh token ( 1 Grade)
//     - check the change credential time date (changeCredentialTime )
//     - generate new access token
//    not completed
// ------------------------------refreshToken----------------------------------
export const refreshToken = asyncHandler(async (req, res, next) => {
  const { authorization } = req.body;
  const [prefix, token] = authorization?.split(" ") || [];
  if (!prefix || !token) {
    return next(new Error("invalid token", { cause: 401 }));
  }
  let SIGNATURE = undefined;
  if (prefix === process.env.PREFIX_TOKEN_ADMIN) {
    SIGNATURE = process.env.SECRET_KEY_ADMIN;
  } else if (prefix === process.env.PREFIX_TOKEN_USER) {
    SIGNATURE = process.env.SECRET_KEY_USER;
  } else {
    return next(new Error("ivalid token prefix", { cause: 401 }));
  }
  const decoded = await verifyToken({ token, SIGNATURE: SIGNATURE });
  if (!decoded?.id) {
    return next(new Error("ivalid token payload", { cause: 403 }));
  }
  const user = await userModel.findById(decoded.id).lean();
  if (!user) {
    return next(new Error("user not found", { cause: 404 }));
  }
  const accessToken =await generateToken({
    payload: { email:user.email,id:user._id },
    SECRET_KEY: user.role == "User" ?
      process.env.SECRET_KEY_USER : process.env.SECRET_KEY_ADMIN,
    option:{expiresIn:"1h"}
  })
  return res.status(201).json({ msg: "done" ,accessToken});
});