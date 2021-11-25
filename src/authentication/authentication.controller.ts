import * as bcrypt from 'bcrypt';
import {Request, Response, NextFunction, Router} from 'express';
import { IControlller } from 'controller.interface'
import userModel from 'users/user.model';
import CreateUserDto from 'users/createUser.dto';
import UserWithThatEmailAlreadyExistException from 'execption/UserWithThatEmailAlreadyExistException';
import User from 'users/user.interface';
import LogInDto from './logIn.dto';
import WrongCredentialException from 'execption/WrongCredentialException';
import validationMiddleWare from 'middleware/vallidation.middleware';

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
            res.send(user);
        }
    }

    private logginIn = async(req : Request,res : Response , next : NextFunction) => {
        const logInData : LogInDto = req.body;
        const user:User = await this.user.findone({email : logInData.email});
        if(user){
            const isPasswordMatching = await bcrypt.compare(logInData.password,user.password);
            if(isPasswordMatching){
                user.password = undefined;
                res.send(user);
            }
            else
            next(new WrongCredentialException());
        }
        else{
            next(new WrongCredentialException());
        }
    }
}

export default AuthenticationController;