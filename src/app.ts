import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';  
import { IControlller } from 'controller.interface';
import { connect } from 'mongoose';
import * as publicIp   from 'public-ip';
import errorMiddleware from './middleware/error.middleware';
class App {
    public app: express.Application;

    constructor(controllers :IControlller[]){
        this.app = express();
        this.initializeMiddleware();
        this.initializeCotrollers(controllers);
        this.connectDatabase();
        this.initializeErrorHandling();
    }

    private initializeMiddleware(){
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
    }

    private initializeCotrollers(controllers:IControlller[])
    {
        controllers.forEach((controller:IControlller)=>
        {
            this.app.use('/',controller.router);
        });
    }

    private connectDatabase(){
        const{
            MONGO_USER,
            MONGO_PASS,
            MONGO_PATH
        } = process.env;

        toDB().catch(err => console.log(err));

        async function toDB():Promise<void> {
            await connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASS}${MONGO_PATH}`);
            console.log('connected to DB,yes!!!');
        }
    }

    private initializeErrorHandling(){
        this.app.use(errorMiddleware);
    }

    public async listen():Promise<void>{
        console.log("My IP address is " + await publicIp.v4());
        this.app.listen(process.env.PORT,()=>{
            console.log(`App liestening on port${process.env.PORT}`);
        });

    }
}

export default App;