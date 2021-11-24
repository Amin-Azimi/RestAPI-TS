import HttpExecption from 'execption/HttpException';
import { Request, Response, NextFunction } from 'express';

function errorMiddleware(error:HttpExecption, request:Request, response:Response, next:NextFunction){
    const status = error.status || 500;
    const message = error.message || 'something went wrong';
    response.status(status).send({
        status,
        message
    });
}

export default errorMiddleware;