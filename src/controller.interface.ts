import * as express from 'express';

export interface IControlller{
    path : string
    router: express.Router;
}