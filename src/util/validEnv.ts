import {
    cleanEnv, str,port
  } from 'envalid';

  export default function validateEnv():void{
      cleanEnv(process.env,{
        MONGO_USER: str(),
        MONGO_PASS : str(),
        MONGO_PATH: str(),
        PORT : port(),
      });
  }