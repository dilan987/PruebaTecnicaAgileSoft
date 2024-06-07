import { UserDomainService } from "../../domain/services/user.service";
import { UserAdapter } from "../../infrastructure/adapters/user.adapter";
import { UserModel, initUserModel } from "../../infrastructure/models/user.model";
import { OrderItem ,WhereOptions } from "sequelize";
import { User } from '../../domain/entities/user.ent';
import jwt from 'jsonwebtoken';

import { TaskAdapter } from "../../infrastructure/adapters/task.adapter";
import { decrypt, encrypt } from "../config/encryptData";

import { TaskModel, initTaskModel } from "../models/task.model";


interface Filters {
    where?: WhereOptions;
    order?: OrderItem[];
}


export class UserRepository extends UserAdapter {
    private userDomainService: UserDomainService = new UserDomainService();
    constructor(
        taskAdapter?: TaskAdapter,
        
    ) {
        super(
            taskAdapter
        )
    }
    
    /**
     * Obtiene todos los usuarios de la base de datos en el formato del dominio.
     */
    
    async findAll(): Promise<Object[] | Error> {
        
        await initUserModel()
        try {
                const usersInfo = await UserModel.findAll()
                const adapter = this.mapToDomainArray(usersInfo)
                const filteredUsers = adapter.map(user => {
                    const { password, ...filteredUser } = user;
                    return filteredUser;
                });
                return filteredUsers
        } catch (error: any) {
            const err = new Error(error)
            return err
        }
    }
    //buscar a un usuario particular
    async findOne(id: string): Promise<Object | Error> {
        
        await initUserModel()
        try {
                const usersInfo = await UserModel.findByPk(id)
                const adapter = this.mapToDomain(usersInfo)
                if (!adapter) {
                    throw new Error('Error in map to domain');
                }
                const dto = {
                    id: adapter.id,
                    name: adapter.name,
                    userName: adapter.userName
                }
                return dto
        } catch (error: any) {
            const err = new Error(error)
            return err
        }
    }
    //buscar mi informacion de usuario
    async findMyUser(id: string): Promise<Object | Error> {
        
        await initUserModel()
        await initTaskModel()
        const taskAdapter: TaskAdapter = new TaskAdapter
        try {
                const usersInfo = await UserModel.findOne({where:{id: id}
                })
                const adapter = this.mapToDomain(usersInfo)
                if (!adapter) {
                    throw new Error('Error in map to domain');
                }
                const tasks = await TaskModel.findAll({where: {userId: adapter.id}})
                const adapterTasks = taskAdapter.mapToDomainArray(tasks)
                adapter.password = await decrypt(adapter.password)
                const taskFilter = adapterTasks.map(task => {
                    let Status
                    if(task.status == true) Status = 'Resuelto'
                    else Status = 'No Resuelto'
                    const filteredTask ={
                        id: task.id,
                        name:task.name,
                        status: Status,
                        description: task.description,
                        createdOn : task.createdOn,
                        updatedOn: task.updatedOn
                    }
                    return filteredTask;
                });
                const dto = {
                    id: adapter.id,
                    name: adapter.name,
                    userName: adapter.userName,
                    password : adapter.password,
                    usertasks: taskFilter
                }
                return dto
        } catch (error: any) {
            const err = new Error(error)
            return err
        }
    }
    async create(userData: Partial<User>): Promise<User | Error> {
        await initUserModel()
        const requireAttributes: (keyof User)[] = ['name', 'userName', 'password'];

        try {
            const usersValidate = await UserModel.findOne(
                {
                    where: {
                        userName:userData.userName
                    }
                }
            ) 
            if(usersValidate) throw new Error('UserName already exist');  
            const password = userData.password as string
            const hashedPassword = await encrypt(password)
            const entityUser = this.userDomainService.creatEmptyEntity();

            Object.assign(entityUser,userData);
            entityUser.password = hashedPassword

            for (const attr of requireAttributes) {
                if(!(attr in entityUser)) {
                    throw new Error(`${attr} is required`);
                }
            }
            const userModel = await UserModel.create(entityUser);
            const adaptedUser = this.mapToDomain(userModel);

            if (!adaptedUser) {
                throw new Error('Error in map to domain');
            }
           
            return adaptedUser;   

        }catch (error: any) {
            const err = new Error(error)
            console.log(err)
            return err
         }
    }
    
    async login(userName: string, password: string): Promise<string | Error> {
        await initUserModel()
        try {
            const usersValidate = await UserModel.findOne(
                {
                    where: {
                        userName:userName
                    }
                }
            ) 
            if(!usersValidate) throw new Error('User not found');  
            const decrypPassword = await decrypt(usersValidate.dataValues.password)
            if ( decrypPassword != password) throw new Error('Invalid password');
            const token = jwt.sign({ userId: usersValidate.dataValues.id }, 'your-secret-key', { expiresIn: '1h' });

            return token;

        }catch (error: any) {
            const err = new Error(error)
            return err
        }
    }
}