import nodemailer from "nodemailer";
import { User } from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import ApiError from "../helpers/ApiError.js";

const sendEmail = async function(email, emailType, userId){
    try {
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);
        if(emailType === "EMAIL_VERIFICATION"){
            await User.findByIdAndUpdate(userId, {
                verificationToken: hashedToken,
                verificationTokenExpiry: Date.now() + 3600000, //1 hour expiry time, in milliseconds, from curr time.
            });
        }else if(emailType === "RESET_PASSWORD"){
            await User.findByIdAndUpdate(userId, {
                resetPasswordToken: hashedToken,
                resetPasswordTokenExpiry: Date.now() + 3600000,
            });
        }else if(emailType === "FORGOT_PASSWORD"){
            await User.findByIdAndUpdate(userId, {
                forgotPasswordToken: hashedToken,
                forgotPasswordTokenExpiry: Date.now() + 3600000,
            });
        }

        const transport = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth:{
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const emailSubject = emailType === "EMAIL_VERIFICATION" ? "Verify your email" : emailType === "RESET_PASSWORD" ? "Reset your password" : "Forgot Password";
        const redirLink = emailType === "EMAIL_VERIFICATION" ? `${process.env.DOMAIN}/verify-email?token=${hashedToken}` : emailType === "RESET_PASSWORD" ? `${process.env.DOMAIN}/reset-password?token=${hashedToken}` : `${process.env.DOMAIN}/forgot-password?token=${hashedToken}`;
        const mailOptions = {
            from: "noreply@myapp.com",
            to: email,
            subject: {emailSubject},
            html: `<p>Click <a href=${redirLink}>here</a>
            to ${emailSubject}</p>`
        }

        const mailResponse = await transport.sendMail(mailOptions);
        return mailResponse;

    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Error Sending Email!");
    }
}

export { sendEmail };