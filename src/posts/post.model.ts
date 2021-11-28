import { Schema, model,Document  } from 'mongoose';
import Post from './post.interface';

const postSchema=new Schema({
    author:{
        ref: 'User',
        type : 'ObjectId'
    },
    content :{type: String},
    title :{type:String}
});

// const postModel  = model<Post & Document>('Post',postSchema);
const postModel = model<Post>('Post',new Schema({
    author:{
        ref: 'User',
        type : 'ObjectId'
    },
    content :String,
    title :String

}));

export default postModel;

// import * as mongoose from 'mongoose';
// import Post from './post.interface';

// const postSchema = new mongoose.Schema({
//   author: {
//     ref: 'User',
//     type: mongoose.Schema.Types.ObjectId,
//   },
//   content: String,
//   title: String,
// });

// const postModel = mongoose.model<Post & mongoose.Document>('Post', postSchema);

// export default postModel;