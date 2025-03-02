
import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    companyName: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: async function(value) {
                const company = await this.constructor.findOne({ companyName: value });
                if (company) {
                        return false;
                    }
                    return true;
            },
            message: 'Not allowed: Company name already exists. Please choose a different name.'
        }
    },
    description: {
        type: String,
        minLength:3
    },
    industry: {
        type: String,
    },
    address: {
        type: String, 
    },
    numberOfEmployees: {
        type: String,
        required: true,
        validate: {
          validator: function(value) {
            const rangePattern = /^\d{2}-\d{2}$/;
            return rangePattern.test(value);
          },
          message: 'number Of Employees must be range and formatted as xx-xx'
        }
    },
    companyEmail: {
        type: String,
        unique: true,
        validate: {
            validator: async function(value) {
                const company = await this.constructor.findOne({ companyEmail: value });
                if (company) {
                        return false;
                    }
                    return true;
            },
            message: 'Not allowed: Company email already exists. Please choose a different name.'
        }
    },
    CreatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    Logo:{
        secure_url: String,
        public_id: String
      },
    coverPic:{
        secure_url: String,
        public_id: String
    },
    HRs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    bannedAt: Date,
    deletedAt: Date,
    legalAttachment:{
        secure_url: String,
        public_id: String
    },
    approvedByAdmin: {
        type: Boolean,
        default:false
    }
}, {
    timestamps:true
})


const companyModel = mongoose.models.Company || mongoose.model("Company", companySchema)
export default companyModel