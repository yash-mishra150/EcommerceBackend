const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../schema/auth/userSchema');
const OtpVerification = require('../schema/auth/otpVerification'); 
require('dotenv').config();
const router = express.Router();

router.post('/send-otp', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (user.isVerifed) {
            return res.status(400).json({ message: 'User already verified.' });
        }

        await OtpVerification.deleteMany({ email: email, otpExpiry: { $lt: Date.now() } });

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); 
        const otpHash = crypto.createHash('sha256').update(otp).digest('hex'); 

        const otpExpiry = Date.now() + 5 * 60 * 1000; 


        await OtpVerification.create({
            email: email,
            otpHash: otpHash,
            otpExpiry: otpExpiry
        });
        

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });


        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Your OTP for Email Verification',
            text: `Your OTP is: ${otp}`
        };


        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                return res.status(500).json({ message: 'Failed to send OTP', error });
            }
            return res.status(200).json({ message: 'OTP sent successfully' });
        });
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred', error: error.message });
    }
});


router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        const otpHash = crypto.createHash('sha256').update(otp).digest('hex'); 
        const otpRecord = await OtpVerification.findOne({ email: email });


        if (!otpRecord) {
            return res.status(400).json({ message: 'No OTP record found. Please request a new OTP.' });
        }


        if (otpRecord.otpExpiry < Date.now()) {
            await OtpVerification.deleteOne({ email: email }); 
            return res.status(400).json({ message: 'OTP expired. Please request a new OTP.' });
        }


        if (otpRecord.otpHash !== otpHash) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        const user = await User.findOne({ email: email });
        if (user.isVerifed) {
            await OtpVerification.deleteOne({ email: email });
            return res.status(400).json({ message: 'User already verified.' });
        }


        await OtpVerification.deleteOne({ email: email }); 


        await User.findOneAndUpdate(
            { email: email }, 
            { isVerifed: true }, 
            { new: true } 
        );

        return res.status(200).json({ message: 'OTP verified successfully, user verified.' });
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred', error: error.message });
    }
});


module.exports = router;
