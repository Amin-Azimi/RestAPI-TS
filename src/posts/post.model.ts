import { Schema, model, connect } from 'mongoose';
import Post from './post.interface';

const postSchema=new Schema<Post>({
    author:{
        ref: 'User',
        type : 'ObjectId'
    },
    content :{type: String, required:true},
    title :{type:String ,required:true}
});

const postModel  = model<Post>('Post',postSchema);

export default postModel;