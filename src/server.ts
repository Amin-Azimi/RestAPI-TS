import PostController from './posts/post.controller';
import App from './app';
import 'dotenv/config';
import validateEnv from './util/validEnv';

validateEnv();
const app = new App(
    [new PostController()]
);

app.listen();
