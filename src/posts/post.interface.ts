import { Schema, model, Document, Types } from 'mongoose';
export default interface Post  {
    author?: Types.ObjectId;
    content: string;
    title: string;
  }
  
