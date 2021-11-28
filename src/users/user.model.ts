
import { Schema,model } from "mongoose";
import User from "./user.interface";

const userShcema = new Schema<User>({
    name:String,
    email : String,
    password:String
});

const userModel = model<User>('User',userShcema);
export default userModel;
