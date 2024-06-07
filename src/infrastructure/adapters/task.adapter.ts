import { Task } from "../../domain/entities/task.ent";
import { TaskModel } from "../models/task.model";

export class TaskAdapter {

    public mapToDomain(taskModel: TaskModel | undefined | null): Task | undefined {
        if(!taskModel) return undefined;
        const task = new Task(
            taskModel.id, 
            taskModel.userId, 
            taskModel.name, 
            taskModel.status, 
            taskModel.description,
            taskModel.createdOn,
            taskModel.updatedOn
            );
        return task;
    }

    public mapToDomainArray(taskModels: TaskModel[] | undefined): Task[] | [] {
        if (!taskModels) return [];
        return taskModels.map(taskModel => this.mapToDomain(taskModel)) as Task[];
    }
}