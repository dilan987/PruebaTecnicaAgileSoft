
import { OrderItem ,WhereOptions } from "sequelize";
import { TaskAdapter } from "../adapters/task.adapter";
import { TaskModel, initTaskModel } from "../models/task.model";
import { TaskDomainService } from "../../domain/services/task.service";
import { Task } from "../../domain/entities/task.ent";


interface Filters {
    where?: WhereOptions;
    order?: OrderItem[];
}

type TaskMutableProperties = 'name' | 'status' | 'description';

export class TaskRepository extends TaskAdapter {
    private taskDomainService: TaskDomainService = new TaskDomainService();
    
    async findAll(): Promise<Object[] | Error> {
        
        await initTaskModel()
        try {
                const tasksInfo = await TaskModel.findAll()
                const adapter = this.mapToDomainArray(tasksInfo)
                const taskFilter = adapter.map(task => {
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
                return taskFilter
        } catch (error: any) {
            const err = new Error(error)
            return err
        }
    }
    //buscar tareas a un usuario particular
    async findByUser(userId: string): Promise<Object[] | Error> {
        
        await initTaskModel()
        try {
                const tasksInfo = await TaskModel.findAll({where:{ userId: userId}})
                const adapter = this.mapToDomainArray(tasksInfo)
                if (!adapter) {
                    throw new Error('Error in map to domain');
                }
                const taskFilter = adapter.map(task => {
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
                return taskFilter
        } catch (error: any) {
            const err = new Error(error)
            return err
        }
    }
    async create(taskData: Partial<Task>, userId: string): Promise<Task | Error> {
        await initTaskModel()
        const requireAttributes: (keyof Task)[] = ['name'];

        try {
            const entityTask = this.taskDomainService.creatEmptyEntity();
            Object.assign(entityTask,taskData);
            entityTask.userId = userId

            for (const attr of requireAttributes) {
                if(!(attr in entityTask)) {
                    throw new Error(`${attr} is required`);
                }
            }
            const taskModel = await TaskModel.create(entityTask);
            const adaptedTask = this.mapToDomain(taskModel);

            if (!adaptedTask) {
                throw new Error('Error in map to domain');
            }
            return adaptedTask;   

        }catch (error: any) {
            const err = new Error(error)
            console.log(err)
            return err
         }
    }
    async update( taskData: any, userId: string): Promise <Task | Error> {
        const mutableProperties: Array<TaskMutableProperties> = ['name', 'status' , 'description'];

        await initTaskModel()
        try {
            const tasksInfo = await TaskModel.findOne({where:{ userId: userId, id:taskData.id}})
            if(tasksInfo == null) throw new Error('the selected task is not found with this user');

            const task = await TaskModel.findByPk(taskData.id);
            if(!task){
                throw new Error('task not valid');
            }
            const modifiedProperties: Partial<TaskModel> = {};
    
            for (const key in taskData){
                if(mutableProperties.includes(key as TaskMutableProperties)) {
                    modifiedProperties[key as TaskMutableProperties] = taskData[key];
                }
            }
    
            Object.assign(task, modifiedProperties);

            await task.save();
    
            const adaptedtask = this.mapToDomain(task);
            if(!adaptedtask) {
                throw new Error('data structure not found');
            }
            return adaptedtask;   
        } catch (error: any) {
            const err = new Error(error)
            console.log(err)
            return err
         }
    }
    async delete(id: string, userId: string): Promise <boolean | Error> {
        await initTaskModel()
        try {
            const tasksInfo = await TaskModel.findOne({where:{ userId: userId, id:id}})
            if(tasksInfo == null) throw new Error('the selected task is not found with this user');
            const result = await TaskModel.destroy({ where: { id}});
            return result > 0;   
        } catch (error: any) {
            const err = new Error(error)
            return err
        }
    }
}