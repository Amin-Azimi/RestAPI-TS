import mongoose from 'mongoose';
import { User } from '../users/user.inerface';

export default interface Post  {
    content: string;
    title: string;
    user :  User | string
  }
  
