import * as  mongoose from 'mongoose';
import Post from './post.interface';

export interface PostDoc extends Post, mongoose.Document {}

type PostModel = mongoose.Model<PostDoc>;

export type PostDocLean = mongoose.LeanDocument<PostDoc>;

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
    },
    title: {
      type: String,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  }
);

export default mongoose.model<PostDoc, PostModel>("Post", postSchema);
