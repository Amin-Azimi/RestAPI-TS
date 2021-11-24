import { IControlller } from 'controller.interface';
import PostNotFoundExecption from '../execption/PostNotFoundExecption';
import { Request, Response, NextFunction, Router } from 'express';
import Post from './post.interface';
import postModel from './post.model';
import validationMiddleWare from '../middleware/vallidation.middleware';
import CraetePostDto from './post.dto';

class PostController implements IControlller{
    public path :string="/posts";
    public router :Router = Router();

    private posts:Post[]=[
        {
            author:"amin",
            content:"Chieee",
            title:"Noch"
        }
    ];
    constructor(){
        this.initializeRoutes();
    }

    public initializeRoutes(){
        this.router.get(this.path,this.getAllPosts);
        this.router.get(`${this.path}/:id`,this.getPostById);
        this.router.post(this.path,validationMiddleWare<CraetePostDto>(CraetePostDto) ,this.createAPost);
        this.router.patch(`${this.path}/:id`,validationMiddleWare<CraetePostDto>(CraetePostDto,true) ,this.modifyPost);
        this.router.delete(`${this.path}/:id`,this.removePost);
    }

    getAllPosts= (request:Request,reponse : Response)=>{
        postModel.find()
        .then((ps:any) =>
            reponse.send(ps));
    }

    getPostById= (request: Request,reponse : Response,next :NextFunction)=>{
        const Id = request.params.id;
        console.log('By Id Called:'+Id);
        // if(request.params && request.params.id && typeof request.params.id === "string")
        // {
            postModel.findById(Id).then((post: any) => {
                if(post){
                    reponse.send(post);
                }
                else{
                    next(new PostNotFoundExecption(Id));
                }
            });
        // }
    }

    createAPost = (request:Request, response:Response) =>{
        const post:Post = request.body;
        console.log(`create called${post}`);
        const createdPost = new postModel(post);
        createdPost.save()
        .then(savedPost =>{
            response.send(savedPost);
        })
    }

    modifyPost = (request:Request, response:Response) =>{
        const Id = request.params.id;
        const postData = request.body;
        console.log(`Modify Called:+${Id}`);
        if(request.params && request.params.id && typeof request.params.id === "string")
        {
            postModel.findByIdAndUpdate(Id,postData,{new:true}).then((ps: any) => response.send(ps));
        }
        
    }

    removePost = (request:Request, response:Response) =>{
        const Id = request.params.id;
        console.log(`remove Called:+${Id}`);
        if(request.params && request.params.id && typeof request.params.id === "string")
        {
            postModel.findByIdAndDelete(Id).then(successResponse =>{
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