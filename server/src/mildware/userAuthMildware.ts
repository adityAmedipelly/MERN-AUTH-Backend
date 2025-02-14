import jwt from "jsonwebtoken"
import { Request,Response,NextFunction } from "express";

interface JwtPayloadWithId {
  id: string;
}

const userAuth = async (req:Request, res:Response, next:NextFunction): Promise<void>=>{
    const {token} = req.cookies;


    if(!token){
         res.json({
            success: false, message: 'Not Authorized. Login Again'
        })
        return
    }

    try{
      const secret = process.env.JWT_SECRET || 'default_secret';
      const tokenDecode =   jwt.verify(token, secret) as JwtPayloadWithId

      if(tokenDecode.id){
        req.body.userId = tokenDecode.id
      }else{
         res.json({sucess: false, message: 'not Authonized login again'})
         return
      }

      next();

    }catch(error:any){
        res.json({sucess: false, message: error.message})
    }
}

export default userAuth;
