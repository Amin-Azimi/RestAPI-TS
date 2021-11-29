import { IControlller } from 'controller.interface';
import PostNotFoundExecption from '../execption/PostNotFoundExecption';
import { Request, Response, NextFunction, Router, response } from 'express';
import PostModel from './post.model';
import validationMiddleWare from '../middleware/vallidation.middleware';
import CraetePostDto from './post.dto';
import authMiddleware from '../middleware/auth.middleare';
import RequestWithUser from '../authentication/requestWithUser';
import User from '../users/user.interface';
import userModel from '../users/user.model';

class PostController implements IControlller{
    public path :string="/posts";
    public router :Router = Router();

     constructor(){
        this.initializeRoutes();
    }

    public initializeRoutes(){
        this.router.get(this.path,this.getAllPosts);
        this.router.get(`${this.path}/:id`,this.getPostById);
        this.router
        .all(`${this.path}/*`,authMiddleware)
        .patch(`${this.path}/:id`,validationMiddleWare<CraetePostDto>(CraetePostDto,true) ,this.modifyPost)
        .delete(`${this.path}/:id`,this.removePost)
        .post(this.path,authMiddleware,validationMiddleWare<CraetePostDto>(CraetePostDto) ,this.createAPost);
    }

    getAllPosts= (request:Request,reponse : Response)=>{
        PostModel.find()
        .then((ps:any) =>
            reponse.send(ps));
    }

    getPostById=  (request: Request,reponse : Response,next :NextFunction)=>{
        const Id = request.params.id;
        console.log('By Id Called:',Id);
         PostModel.findById(Id).lean().then(post =>reponse.json(post))
             .catch(error =>  reponse.status(500).send({ result: error, 'isError': true }));
    }

    //this method get a Post DTO from body and after convert It to PostModel it will save it
    createAPost = async(request:RequestWithUser, response:Response) =>{
        const postDto:CraetePostDto = request.body;
        const userId = request.user._id;
        const ur = await userModel.findById(userId);
        const newPost =await PostModel.create({
            content : postDto.content,
            title : postDto.title,
            user: userId
        });
        console.log('new is: '+newPost);
        const postLean = await PostModel.findById(newPost._id).populate<{ user: User }>('user','-password').orFail().then(doc => {
            console.log("chikd ==", doc.user);
        });
        console.log("my number", postLean);
        response.send(postLean);
    }

    modifyPost = (request:Request, response:Response) =>{
        const Id = request.params.id;
        const postData = request.body;
        console.log(`Modify Called:${Id}`);
        if(request.params && request.params.id && typeof request.params.id === "string")
        {
            PostModel.findByIdAndUpdate(Id,postData,{new:true}).then((ps: any) => response.send(ps));
        }
        
    }

    removePost = (request:Request, response:Response) =>{
        const Id = request.params.id;
        console.log(`remove Called:${Id}`);
        if(request.params && request.params.id && typeof request.params.id === "string")
        {
            PostModel.findByIdAndDelete(Id).then(successResponse =>{
                if(successResponse){
                    response.send(200);
                }
                else{
                    response.send(404);
                }
            });
        }
    }

}

export default PostController;