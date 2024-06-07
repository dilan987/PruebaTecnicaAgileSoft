import { verifyJWT } from "../application/middlewares/verifySignup";
import UserController from "../application/controllers/userController";
import {Request, Response, Router } from "express";


export const register = (router: Router): void => {
    const controller = new UserController();

    //get opcional, ver todos los usuarios
    router.get('/get-all/user',[verifyJWT] ,(req: Request, res: Response) => {
        controller.getAll(req, res);
    });
    //get opcional, ver un usuario cualquiera
    router.get('/get/', [verifyJWT] , (req: Request, res: Response) => {
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