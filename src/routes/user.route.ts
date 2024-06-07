import { verifyJWT } from "../application/middlewares/verifySignup";
import UserController from "../application/controllers/userController";
import {Request, Response, Router } from "express";
import cookieParser from 'cookie-parser';

export const register = (router: Router): void => {
    const controller = new UserController();


    router.get('/get-all/user',[verifyJWT] ,(req: Request, res: Response) => {
        controller.getAll(req, res);
    });

    router.get('/get/', (req: Request, res: Response) => {
        controller.getUser(req, res);
    });

    router.post('/create', (req: Request, res: Response) => {
        controller.postNewUser(req, res);
    });

    router.post('/login', (req: Request, res: Response) => {
        controller.logIn(req, res);
    });
    router.post('/logout', (req: Request, res: Response) => {
        controller.logOut(req, res);
    });

    router.get('/myuserdata', [verifyJWT] ,(req: Request, res: Response) => {
        controller.myUserInfo(req, res);
    });
}