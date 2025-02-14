import userModel from "../models/userModel";
import { Request,Response } from "express";

export const getUserData = async (req:Request,res:Response)=>{
    try{
        const {userId} = req.body;

        const user = await userModel.findById(userId)

        if(!user){
            res.json({
                success: false, message: "User not found"
            })
        }

        res.json({
            success: true,
            userData:{
                name:user.name,
                isAccountVerified: user.isAccountVerified
            }
        })

    }catch(error:any){
        res.json({
            success: false, message: error.message 
        })

    }
}
