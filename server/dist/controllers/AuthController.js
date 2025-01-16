"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.sendResetOtp = exports.isAuthenticated = exports.verifyEmail = exports.sendVerfiyOpt = exports.logout = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const nodemailer_1 = __importDefault(require("../config/nodemailer"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.json({ success: false, message: "Missing Deatils" });
        return;
    }
    try {
        const existingUser = yield userModel_1.default.findOne({ email });
        if (existingUser) {
            res.json({ success: false, message: "user already exits" });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = new userModel_1.default({ name, email, password: hashedPassword });
        yield user.save();
        const secret = process.env.JWT_SECRET || 'default_secret';
        const token = jsonwebtoken_1.default.sign({ id: user._id }, secret, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'Production',
            sameSite: process.env.NODE_ENV === 'production' ?
                'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        //sending welcome mail
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'welcome to AdiTec',
            text: `welcome to AdiTec. Your account has bee created  with email id: ${email}`
        };
        yield nodemailer_1.default.sendMail(mailOptions);
        res.json({ success: true });
    }
    catch (error) {
        res.json({ success: false, message: error.message });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.json({ success: false, message: 'Email and password are required' });
        return;
    }
    try {
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            res.json({ success: false, message: 'Invalid email' });
            return;
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.json({ success: false, message: "Invalid password" });
            return;
        }
        const secret = process.env.JWT_SECRET || 'default_secret';
        const token = jsonwebtoken_1.default.sign({ id: user._id }, secret, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'Production',
            sameSite: process.env.NODE_ENV === 'production' ?
                'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.json({ success: true });
    }
    catch (error) {
        res.json({ success: false, message: error.message });
        return;
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'Production',
            sameSite: process.env.NODE_ENV === 'production' ?
                'none' : 'strict',
        });
        res.json({ success: true, message: "Logged Out" });
        return;
    }
    catch (error) {
        res.json({ success: false, message: error.message });
        return;
    }
});
exports.logout = logout;
// send verification otp to user email
const sendVerfiyOpt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        const user = yield userModel_1.default.findById(userId);
        if (user.isAccountVerified) {
            res.json({ sucess: false, message: " Account is Already verified" });
            return;
        }
        const otp = String(Math.floor(1000000 + Math.random() * 9000000));
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
        yield user.save();
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification otp',
            text: `Your OTP is ${otp}. Verify your account using this OTP`
        };
        yield nodemailer_1.default.sendMail(mailOption);
        res.json({ sucess: true, message: "Verification OTP sent on Email" });
    }
    catch (error) {
        res.json({ sucess: false, message: error.message });
    }
});
exports.sendVerfiyOpt = sendVerfiyOpt;
// verif otp
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, otp } = req.body;
    if (!userId || !otp) {
        res.json({ sucess: false, message: "Missing Details" });
        return;
    }
    try {
        const user = yield userModel_1.default.findById(userId);
        if (!user) {
            res.json({ sucess: false, message: 'user not found' });
            return;
        }
        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            res.json({ sucess: false, message: 'invalid OTP' });
            return;
        }
        if (user.verifyOtpExpireAt < Date.now()) {
            res.json({ sucess: false, message: 'OTP Expired' });
            return;
        }
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;
        yield user.save();
        res.json({ sucess: false, message: 'Email verified successfully' });
        return;
    }
    catch (error) {
        res.json({ sucess: false, message: error.message });
        return;
    }
});
exports.verifyEmail = verifyEmail;
// check if user is Authenticated 
const isAuthenticated = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json({ success: true });
        return;
    }
    catch (error) {
        res.json({ sucess: false, message: error.message });
    }
});
exports.isAuthenticated = isAuthenticated;
// send password Rest OTP
const sendResetOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        res.json({ sucess: false, message: 'email is required' });
        return;
    }
    try {
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            res.json({
                success: false, message: 'user not found'
            });
            return;
        }
        const otp = String(Math.floor(1000000 + Math.random() * 9000000));
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
        yield user.save();
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Rest OTP',
            text: `Your OTP for reseting your password is ${otp}. Use this OTP to proceed with reseting your password`
        };
        yield nodemailer_1.default.sendMail(mailOption);
        res.json({
            success: true, message: 'OTP send to your email'
        });
        return;
    }
    catch (error) {
        res.json({ sucess: false, message: error.message });
    }
    return;
});
exports.sendResetOtp = sendResetOtp;
// Reset User Password
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
        res.json({
            success: false, message: 'email, otp, and new password are required'
        });
        return;
    }
    try {
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            res.json({
                succes: false, message: 'user not found'
            });
            return;
        }
        if (user.resetOtp === "" || user.resetOtp !== otp) {
            res.json({
                success: false, message: 'Invalid OTP'
            });
            return;
        }
        if (user.resetOtpExpireAt < Date.now()) {
            res.json({
                sucess: false, message: "OTP Expired"
            });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;
        yield user.save();
        res.json({
            success: false, message: 'password has been reset successfuly'
        });
        return;
    }
    catch (error) {
        res.json({
            success: false, message: error.message
        });
        return;
    }
});
exports.resetPassword = resetPassword;
