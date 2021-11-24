import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import * as express from 'express';
import HttpExecption from '../execption/HttpException';

function validationMiddleWare<T>(type:any, skipMissingProperties = false): express.RequestHandler{
return(req,res,next) => {
    validate(plainToClass(type,req.body),{skipMissingProperties})
    .then((errors:ValidationError[]) =>{
        if(errors.length >0){
            const message = errors.map((error:ValidationError) => Object.values(error.constraints)).join(',');
            next(new HttpExecption(400,message));
        }
        else{
            next();
        }
    });
}

}

export default validationMiddleWare;