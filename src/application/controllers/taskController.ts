import httpStatus from "http-status";
import { Controller } from "./controller";
import { Request, Response } from "express";




export default class TaskController implements Controller {

    run(req: Request, res: Response): void {
        res.status(httpStatus.OK).json({ TaskControllerStatus : 'OK'});
    }

}