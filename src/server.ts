import PostController from './posts/post.controller';
import App from './app';
import 'dotenv/config';
import validateEnv from './util/validEnv';
import AuthenticationController from './authentication/authentication.controller';

validateEnv();
const app = new App(
    [new PostController(),
    new AuthenticationController()]
);

app.listen();
