import HttpExecption from "./HttpException";

class PostNotFoundExecption extends HttpExecption{
    constructor(id:string){
        super(404,`Post id:${id} not found`);
    }
}

export default PostNotFoundExecption;