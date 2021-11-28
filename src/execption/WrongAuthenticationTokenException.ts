import HttpExecption from "./HttpException";
import WrongCredentialException from "./WrongCredentialException";

class WrongAuthenticationTokenException extends HttpExecption{
    constructor(){
        super(401,'Wrong authentication token');
    }
}
export default WrongAuthenticationTokenException;