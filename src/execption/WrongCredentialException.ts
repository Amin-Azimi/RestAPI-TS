import HttpExecption from "./HttpException";

class WrongCredentialException extends HttpExecption{
    constructor(){
        super(401,'Wrong credential provided');
    }
}
export default WrongCredentialException;
