"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userAuthMildware_1 = __importDefault(require("../mildware/userAuthMildware"));
const userDeatils_1 = require("../controllers/userDeatils");
const userRouter = express_1.default.Router();
userRouter.get('/data', userAuthMildware_1.default, userDeatils_1.getUserData);
exports.default = userRouter;
