import express from "express"
import userAuth from "../mildware/userAuthMildware";
import { getUserData } from "../controllers/userDeatils";

const userRouter = express.Router();

userRouter.get('/data',userAuth, getUserData);

export default userRouter
