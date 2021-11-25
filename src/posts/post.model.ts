import { Schema, model, connect } from 'mongoose';
import Post from './post.interface';

const postSchema=new Schema<Post>({
    authorId:{type : String,required:true},
    content :{type: String, required:true},
    title :{type:String ,required:true}
});

const postModel  = model<Post>('Post',postSchema);

export default postModel;