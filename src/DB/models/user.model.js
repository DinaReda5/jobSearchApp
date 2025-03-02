import mongoose from "mongoose";
import { encrypt, Hash } from "../../utilits/index.js";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim:true
    },
    lastName: {
        type: String,
        required: true,
        trim:true
    },
    
    email: {
        type: String,
        required: true,
        unique: true,
        trim:true,
    },
    password: {
      type: String,
      // required: function (data) {
      //   return data.provider=="google"?false:true
      // },
        trim:true
    },
    provider: {
        type: String,
        required: true,
        enum: ['google','system'],
        default:'system'
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male','Female'],
        default:'Male'
    },
    DOB: {
        type: Date,
        validate: [
            {
              validator: function (value) {
                // Check if the date is in the past
                return value < new Date();
              },
              message: 'Date of Birth must be smaller than the current date.'
            },
            {
              validator: function (value) {
                // Check if age is greater than or equal to 18 years
                const currentDate = new Date();
                const ageDiff = new Date(currentDate - value);
                const age = ageDiff.getUTCFullYear() - 1970; // Calculate the age
                return age >= 18;
              },
              message: 'Age must be greater than or equal to 18 years. Not allowed.'
            }
          ]
      },
    mobileNumber: {
        type: String,
        trim:true
    },
    role: {
        type: String,
        enum: ['User', 'Admin'],
        default:'User'
    },
    isConfirmed: {
        type: Boolean,
        default:false
    },
    bannedAt:{
        type: Date,
    }, 
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    changeCredentialTime: Date,
    profilePic: {
        secure_url: String,
        public_id: String
      },
      coverPic: {
        secure_url: String,
        public_id: String
      },
      OTP: [{
        code: String,
        type: {
          type: String,
          enum: ['confirmEmail', 'forgetPassword']
        },
        expiresIn: Date
  }],
  deletedAt:Date,
}, {
  timestamps: true
})
userSchema.virtual('username').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

userSchema.pre('save', async function(next) {
  const user = this;

 
  if (user.provider=="system") {
     // Hash the password
      user.password = await Hash({key:user.password, SALT_ROUNDS:process.env.SALT_ROUNDS});

  // Encrypt the phone number
  user.mobileNumber = await encrypt({ key: user.mobileNumber, SIGNATURE: process.env.SIGNATURE });
  }
  next();
});

const userModel = mongoose.models.User || mongoose.model("User", userSchema)
export default userModel