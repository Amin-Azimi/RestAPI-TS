import * as bcrypt from 'bcrypt';
import {Request, Response, NextFunction, Router} from 'express';
import * as jwt from 'jsonwebtoken';
import { IControlller } from 'controller.interface'
import userModel from 'users/user.model';
import CreateUserDto from 'users/createUser.dto';
import UserWithThatEmailAlreadyExistException from 'execption/UserWithThatEmailAlreadyExistException';
import User from 'users/user.interface';
import LogInDto from './logIn.dto';
import WrongCredentialException from 'execption/WrongCredentialException';
import validationMiddleWare from 'middleware/vallidation.middleware';
import ToeknData from './tokenData';
import DataStoreInToken from './dataStoredInToken';

class AuthenticationController implements IControlller{
    public path:string ='/auth';
    public router : Router= Router();
    private user = userModel;

    constructor(){
        this.initilizeRoute();
    }
    private initilizeRoute()
    {
        this.router.post(`${this.path}:/register`,validationMiddleWare(CreateUserDto),this.registeration);
        this.router.post(`${this.path}:/login`,validationMiddleWare(LogInDto),this.logginIn);
        this.router.post(`${this.path}/logout`,this.logOut);
    }
    private registeration= async(req : Request,res: Response,next:NextFunction) =>{
        const userData : CreateUserDto = req.body;
        if(await this.user.findOne({ email: userData.email}))
        {
            next(new UserWithThatEmailAlreadyExistException(userData.email));
        }
        else{
            const hashPassword:string = await bcrypt.hash(userData.password,10);
            const user:User = await this.user.create({
                ...userData,
                password : hashPassword
            });
            user.password = undefined;
            const tokenData = this.createToken(user);
            res.setHeader('Set-Cookie',[this.createCookie(tokenData)]);
            res.json(user);
        }
    }

    private logOut = async(req : Request,res : Response)=>{
        res.setHeader('Set-Cookie',['Authorization=;Max-Age=0']);
        res.send(200);
    }

    private logginIn = async(req : Request,res : Response , next : NextFunction) => {
        const logInData : LogInDto = req.body;
        const user:User = await this.user.findone({email : logInData.email});
        if(user){
            const isPasswordMatching = await bcrypt.compare(logInData.password,user.password);
            if(isPasswordMatching){
                user.password = undefined;
                const tokenData = this.createToken(user);
                res.setHeader('Set-Cookie',[this.createCookie(tokenData)]);
                res.json(user);
            }
            else
            next(new WrongCredentialException());
        }
        else{
            next(new WrongCredentialException());
        }
    }

    private createCookie(tokenData : ToeknData){
        return `Authorization=${tokenData.token};HttpOnly;Max-Age=${tokenData.expiresIn}`;
    }

    private createToken(user:User):ToeknData{
        const expiresIn = 60*60;
        const secret = process.env.JWT_SECRET;
        const dataStoredInToken : DataStoreInToken={
            _id : user._id
        };
        return {
            expiresIn,
            token : jwt.sign(dataStoredInToken,secret,{ expiresIn })
        }
    }
}

export default AuthenticationController;