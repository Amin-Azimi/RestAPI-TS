import HttpExecption from "./HttpException";

class UserWithThatEmailAlreadyExistException extends HttpExecption{
    constructor(email:string){
        super(400,`User with email ${email} already exist`);
    }
}

export default UserWithThatEmailAlreadyExistException;