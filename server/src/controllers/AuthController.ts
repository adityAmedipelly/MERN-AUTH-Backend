import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel';
import transporter from '../config/nodemailer';
import { Request, Response } from 'express';


export const register = async (req: Request,res:Response): Promise<void> =>{

    const {name,email,password} = req.body;


    if(!name || !email || !password){
     res.json({success: false, message: "Missing Deatils"})
     return
    }

    try {
      
        const existingUser = await userModel.findOne({email})

        if(existingUser){
         res.json({success: false, message: "user already exits"})
         return
        }
     
        const hashedPassword = await bcrypt.hash(password, 10);
    


        const user = new userModel({name, email, password:hashedPassword})
        await user.save();
        
        const secret = process.env.JWT_SECRET || 'default_secret';
        const token = jwt.sign({id: user._id}, secret, {expiresIn: '7d'})

        res.cookie('token', token, {
            httpOnly:true,
            secure: process.env.NODE_ENV === 'Production',
            sameSite: process.env.NODE_ENV === 'production' ?
            'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
       //sending welcome mail
        const mailOptions = {
            from : process.env.SENDER_EMAIL,
            to : email,
            subject: 'welcome to AdiTec',
            text: `welcome to AdiTec. Your account has bee created  with email id: ${email}`
        }

        await transporter.sendMail(mailOptions)

         res.json({success: true});

    } catch (error:any){
        res.json({success: false, message: error.message})
    }
}


export const login = async  (req: Request,res:Response): Promise<void> =>{
    const {email,  password} = req.body;



    if(!email || !password){
     res.json({success: false, message: 'Email and password are required'})
     return;
    }

    try {
          const user = await userModel.findOne({email});

          if(!user){
             res.json({success: false, message: 'Invalid email'})
             return;
          }

          const isMatch  = await bcrypt.compare(password,user.password)

           if(!isMatch){
             res.json({success: false, message:"Invalid password"})
             return
           }
           const secret = process.env.JWT_SECRET || 'default_secret';
           const token = jwt.sign({id: user._id}, secret, {expiresIn: '7d'})

           res.cookie('token', token, {
               httpOnly:true,
               secure: process.env.NODE_ENV === 'Production',
               sameSite: process.env.NODE_ENV === 'production' ?
               'none' : 'strict',
               maxAge: 7 * 24 * 60 * 60 * 1000
           })

        res.json({success: true});


    } catch (error: any){
         res.json({ success: false, message: error.message})
         return
    }
}


export const logout = async (req: Request, res:Response): Promise<void>=>{


    try{
        res.clearCookie('token',{
            httpOnly:true,
            secure: process.env.NODE_ENV === 'Production',
            sameSite: process.env.NODE_ENV === 'production' ?
            'none' : 'strict',
        })

         res.json({ success: true, message: "Logged Out"})
         return

    } catch (error:any) {
         res.json({success: false, message: error.message })
         return
    }
}

// send verification otp to user email
export const sendVerfiyOpt  = async(req:Request,res:Response): Promise<void>=>{
    try{
         const{userId} = req.body;


         const user = await userModel.findById(userId)
         if(user.isAccountVerified){
         res.json({sucess: false, message: " Account is Already verified"})
         return
         }

      const otp =  String(Math.floor(1000000 + Math.random() * 9000000)) 
    
      user.verifyOtp = otp
      user. verifyOtpExpireAt = Date.now() + 24* 60 *60 *1000
      
      await user.save()

      const mailOption = {
        from : process.env.SENDER_EMAIL,
        to :user.email,
        subject: 'Account Verification otp',
        text: `Your OTP is ${otp}. Verify your account using this OTP`
      }

      await transporter.sendMail(mailOption)
      res.json({sucess: true, message: "Verification OTP sent on Email"})

    } catch (error:any){
        res.json({sucess: false, message: error.message})
    }
}

// verif otp

export const verifyEmail = async (req:Request, res:Response): Promise<void>=>{
    const {userId, otp} = req.body

    if(!userId || !otp){
         res.json({sucess: false, message: "Missing Details"})
         return
    }
    try{
        const user = await userModel.findById(userId)

        if(!user){
             res.json({sucess: false, message:'user not found'})
             return
        }

        if(user.verifyOtp === '' || user.verifyOtp !==otp){
             res.json({sucess: false, message:'invalid OTP'})
             return
        }

        if(user.verifyOtpExpireAt < Date.now()){
             res.json({sucess: false, message:'OTP Expired'})
             return

        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();
         res.json({sucess: false, message:'Email verified successfully'})
         return


    } catch(error:any){
         res.json({sucess: false, message: error.message})
         return

    }
}


// check if user is Authenticated 

export const isAuthenticated = async (req:Request,res:Response): Promise<void> =>{

    try{
         res.json({success: true});
         return
    } catch(error:any){
        res.json({sucess: false, message: error.message})
    }
}

// send password Rest OTP

export const sendResetOtp = async (req:Request,res:Response): Promise<void>=>{

    const {email} = req.body

    if(!email){
         res.json({sucess: false, message: 'email is required'})
         return
    }

    try{

        const user = await userModel.findOne({email})
        if(!user){
             res.json({
                success: false, message: 'user not found'
            })
            return
        }

        const otp =  String(Math.floor(1000000 + Math.random() * 9000000)) 
    
        user.resetOtp = otp
        user. resetOtpExpireAt = Date.now() + 15 *60 *1000
        
        await user.save()
  
        const mailOption = {
          from : process.env.SENDER_EMAIL,
          to :user.email,
          subject: 'Password Rest OTP',
          text: `Your OTP for reseting your password is ${otp}. Use this OTP to proceed with reseting your password`
        }

        await transporter.sendMail(mailOption)
         res.json({
        success: true, message: 'OTP send to your email'

        })
        return

    }catch(error:any){
         res.json({sucess: false, message: error.message})
    }
    return

}
// Reset User Password
export const resetPassword = async (req:Request, res:Response): Promise<void>=>{
    const {email, otp,newPassword} = req.body;

    if(!email || !otp || !newPassword){
         res.json({
            success: false, message: 'email, otp, and new password are required' 
        })
        return
    }

    try{


        const user = await userModel.findOne({email});
        if(!user){
             res.json ({
                succes: false, message: 'user not found'
            }) 
            return
        }

        if(user.resetOtp === "" || user.resetOtp !== otp){
             res.json({
                success: false, message: 'Invalid OTP'
            })
            return
        }

        if(user.resetOtpExpireAt < Date.now()){
             res.json({
                sucess: false, message:"OTP Expired"
            })
            return
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        await user.save()

         res.json ({
            success: false, message: 'password has been reset successfuly'
        })
        return

    } catch (error:any){
         res.json ({
            success: false, message: error.message
        })
        return
    }

}