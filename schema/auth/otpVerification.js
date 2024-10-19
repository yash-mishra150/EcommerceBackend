const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true,
        unique: true, 
        lowercase: true, 
        trim: true 
    },
    otpHash: { 
        type: String, 
        required: true 
    },
    otpExpiry: { 
        type: Date, 
        required: true 
    }
}, { timestamps: true });

const OtpVerification = mongoose.model('OtpVerification', otpSchema);
module.exports = OtpVerification;
