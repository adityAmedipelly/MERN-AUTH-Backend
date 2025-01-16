"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userAuthMildware_1 = __importDefault(require("../mildware/userAuthMildware"));
const AuthController_1 = require("../controllers/AuthController");
const authRouter = express_1.default.Router();
authRouter.post('/register', AuthController_1.register);
authRouter.post('/login', AuthController_1.login);
authRouter.post('/logout', AuthController_1.logout);
authRouter.post('/send-verify-otp', userAuthMildware_1.default, AuthController_1.sendVerfiyOpt);
authRouter.post("/verify-account", userAuthMildware_1.default, AuthController_1.verifyEmail);
authRouter.post("/is-auth", userAuthMildware_1.default, AuthController_1.isAuthenticated);
authRouter.post("/send-reset-otp", AuthController_1.sendResetOtp);
authRouter.post("/reset-password", AuthController_1.resetPassword);
exports.default = authRouter;
