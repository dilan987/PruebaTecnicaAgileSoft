import httpStatus from "http-status";
import { Controller } from "./controller";
import { Request, Response } from "express";
import { UserRepository } from "../../infrastructure/repositories/user.repository";
import { TaskAdapter } from "../../infrastructure/adapters/task.adapter";
import jwt, { JwtPayload } from 'jsonwebtoken';

export default class UserController implements Controller {

    run(req: Request, res: Response): void {
        res.status(httpStatus.OK).json({ UserControllerStatus : 'OK'});
    }


    async getAll(req: Request, res: Response): Promise<void> {
        const repository = await new UserRepository()
        try {
            let user = await repository.findAll()
            if(user instanceof Error) throw new Error(user.message);
            res.status(httpStatus.OK).json(user)
        } catch (error) {
            console.log(error)
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json('something went wrong')
        }
    }

    async getUser(req: Request, res: Response): Promise<void> {
        const repository = await new UserRepository()
        try {
            const id = req.query.user
            let user = await repository.findOne(id as string)
            if(user instanceof Error) throw new Error(user.message);
            res.status(httpStatus.OK).json(user)
        } catch (error) {
            console.log(error)
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json('something went wrong')
        }
    }

    async postNewUser(req: Request, res: Response): Promise<void> {
        let repository = await new UserRepository()
        try {
            let user = await repository.create(req.body)
            if(user instanceof Error) throw new Error(user.message);
            res.status(httpStatus.OK).json('true')
        } catch (error) {
            console.log(error)
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json('something went wrong')
        }
    }

    async logIn(req: Request, res: Response): Promise<void> {
        let repository = await new UserRepository()
        try {
            let userJWT = await repository.login(req.body.userName,req.body.password)
            if(userJWT instanceof Error) throw new Error(userJWT.message);
            res.cookie('token', userJWT, { httpOnly: true, secure: true });
            res.status(httpStatus.OK).json('token asignado a cookies')
        } catch (error) {
            console.log(error)
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json('something went wrong')
        }
    }

    async logOut(req: Request, res: Response): Promise<void> {
        try {
            res.clearCookie('token');
            res.status(httpStatus.OK).json('Vuelve pronto \(￣︶￣*\))')
        } catch (error) {
            console.log(error)
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json('something went wrong')
        }
    }

    async myUserInfo(req: Request, res: Response): Promise<void> {
        let repository = await new UserRepository()
        try {
            const token = req.cookies["token"] 
            const decoded = jwt.verify(token, 'your-secret-key') as JwtPayload;
            const myUserData = await repository.findMyUser(decoded.userId)
            if(myUserData instanceof Error) throw new Error(myUserData.message);
            res.status(httpStatus.OK).json(myUserData)
        } catch (error) {
            console.log(error)
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json('something went wrong')
        }
    }
}