import { verifyJWT } from "../application/middlewares/verifySignup";
import {Request, Response, Router } from "express";
import TaskController from "../application/controllers/taskController";

export const register = (router: Router): void => {
    const controller = new TaskController();

    router.get('/task/get/', [verifyJWT] , (req: Request, res: Response) => {
        controller.getByUser(req, res);
    });
    router.post('/task/create', [verifyJWT] ,(req: Request, res: Response) => {
        controller.newTask(req, res);
    });
    router.delete('/task/delete', [verifyJWT] ,(req: Request, res: Response) => {
        controller.delete(req, res);
    });
    router.put('/task/update', [verifyJWT] ,(req: Request, res: Response) => {
        controller.updateTask(req, res);
    });
}