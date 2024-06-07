import httpStatus from "http-status";
import { Controller } from "./controller";
import { Request, Response } from "express";
import { TaskRepository } from "../../infrastructure/repositories/task.repository";


export default class TaskController implements Controller {

    run(req: Request, res: Response): void {
        res.status(httpStatus.OK).json({ TaskControllerStatus : 'OK'});
    }

    async getByUser(req: Request, res: Response): Promise<void> {
        const repository = await new TaskRepository()
        try {
            const id = req.query.user
            const tasks = await repository.findByUser(id as string)
            if(tasks instanceof Error) throw new Error(tasks.message);
            res.status(httpStatus.OK).json(tasks)
        } catch (error) {
            console.log(error)
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json('something went wrong')
        }
    }

    async newTask(req: Request, res: Response): Promise<void> {
        const repository = await new TaskRepository()
        try {
            let task = await repository.create(req.body)
            if(task instanceof Error) throw new Error(task.message);
            res.status(httpStatus.OK).json(task)
        } catch (error) {
            console.log(error)
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json('something went wrong')
        }
    }

    async updateTask(req: Request, res: Response): Promise<void> {
        let repository = await new TaskRepository()
        try {
            let taskResult = await repository.update(req.body)
            if(taskResult instanceof Error) throw new Error(taskResult.message);
            res.status(httpStatus.OK).json(taskResult)
        } catch (error) {
            console.log(error)
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json('something went wrong')
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        let repository = await new TaskRepository()
        try {
            const id = req.query.taskId
            let deleteResult = await repository.delete(id as string)
            if(deleteResult instanceof Error) throw new Error(deleteResult.message);
            res.status(httpStatus.OK).json(true)
        } catch (error) {
            console.log(error)
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json('something went wrong')
        }
    }


}