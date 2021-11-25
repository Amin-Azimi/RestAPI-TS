
import { Schema,model } from "mongoose";
import User from "./user.interface";

const userShcema = new Schema<User>({
    name:{type:String,required:true},
    email : {type:String,required:true},
    password:{type:String,required:true}
});

const userModel = model<User>('User',userShcema);
export default userModel;