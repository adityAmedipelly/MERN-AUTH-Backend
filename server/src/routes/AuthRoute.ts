import express from 'express'
import userAuth from '../mildware/userAuthMildware';
import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerfiyOpt, verifyEmail } from '../controllers/AuthController';

 const authRouter = express.Router();


authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout)
authRouter.post('/send-verify-otp', userAuth, sendVerfiyOpt)
authRouter.post("/verify-account", userAuth, verifyEmail)
authRouter.post("/is-auth", userAuth, isAuthenticated)
authRouter.post("/send-reset-otp", sendResetOtp)
authRouter.post("/reset-password", resetPassword)

export default authRouter