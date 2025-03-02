import { Router } from "express";
import * as AS from "./auth.service.js";
import * as AV from "./auth.validation.js";
import { validation } from "../../middleware/validation.js";
const authRouter = Router()
authRouter.post("/signUp", validation(AV.signUpSchema), AS.signUp)
authRouter.patch("/confirmOTP", validation(AV.confirmOTPSchema), AS.confirmOTP)
authRouter.post("/signIn", validation(AV.signInSchema), AS.signIn)
authRouter.post("/signupWithGmail", AS.signupWithGmail)
authRouter.post("/loginWithGmail", AS.loginWithGmail)
authRouter.patch("/forgetPassword", validation(AV.forgetPasswordSchema), AS.forgetPassword)
authRouter.patch("/resetPassword", validation(AV.resetPasswordSchema), AS.resetPassword)
authRouter.get("/refreshToken", validation(AV.refreshTokenSchema), AS.refreshToken)
export default authRouter;