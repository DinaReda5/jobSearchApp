import mongoose from 'mongoose'
import { EventEmitter } from "events";
import { sendEmail } from "../../service/sendEmail.js";
import { customAlphabet } from 'nanoid'
import { Hash } from "../../utilits/index.js";
import {Html} from "../../service/template-email.js"
import userModel from "../../DB/models/user.model.js";
export const eventEmitter = new EventEmitter();

eventEmitter.on("sendEmail", async (data) => {
  //confirm email
  const { email } = data;
  const otp = customAlphabet("0123456789", 4)()
  
  const hashed = await Hash({ key: otp, SALT_ROUNDS: process.env.SALT_ROUNDS })

  await userModel.updateOne(
    { email },
    { OTP: [{ code: hashed, type: "confirmEmail", expiresIn: new Date(Date.now() + 10 * 60 * 1000) }] }
  
  );
  await sendEmail(email, "confirm email", Html({code:otp,action:"Email Confirmation"}));

})

eventEmitter.on("forgetPassword", async (data) => {
  //confirm email
  const { email } = data;
  const otp = customAlphabet("0123456789", 4)()
  const hashed = await Hash({ key: otp, SALT_ROUNDS: process.env.SALT_ROUNDS })
  await userModel.updateOne(
    { email },
    {
      OTP: [{
        code: hashed, type: "forgetPassword",
        expiresIn: new Date(Date.now() + 10 * 60 * 1000)
      }]
    }
  );
  await sendEmail(email, "Forget Password", Html({code:otp,action:"Forget Password"}));
});
eventEmitter.on("reject", async (data) => {
  const { email } = data;
  await sendEmail(email, "rejected", Html({action:"rejected apllication"}));
})
eventEmitter.on("accept", async (data) => {
  const { email } = data;
  await sendEmail(email, "accepted", Html({action:"accepted apllication"}));
})