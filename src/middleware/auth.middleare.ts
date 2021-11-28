import DataStoreInToken from "../authentication/dataStoredInToken";
import RequestWithUser from "../authentication/requestWithUser";
import WrongAuthenticationTokenException from "../execption/WrongAuthenticationTokenException";
import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken";
import userModel from "../users/user.model";

async function authMiddleware(req : RequestWithUser,res : Response,next : NextFunction) {
    const cookie = req.cookies;
    console.log('auth middle is called');
    if(cookie && cookie.Authorization){
        const secrect = process.env.JWT_SECRET;
        try {
            
        const verificationResponse = jwt.verify(cookie.Authorization,secrect) as DataStoreInToken;
        const id = verificationResponse._id;
        const user = await userModel.findById(id);
        if(user){
            req.user = user;
            next();
        }
        else{
            next(new WrongAuthenticationTokenException());
        }
        } 
        catch (error) {
            next(new WrongAuthenticationTokenException());                
        }
    }
    else{
        next(new WrongAuthenticationTokenException());
    }
    
}

export default authMiddleware;