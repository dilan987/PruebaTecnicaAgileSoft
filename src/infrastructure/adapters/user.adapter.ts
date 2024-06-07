import { UserModel } from "../models/user.model";
import { User } from "../../domain/entities/user.ent";
import { TaskAdapter } from "./task.adapter";


export class UserAdapter {
    private taskAdapter?: TaskAdapter;

    constructor(
        taskAdapter?: TaskAdapter,
    ){
        this.taskAdapter = taskAdapter;
    }

    public mapToDomain(
        UserModel: UserModel | undefined | null): User | undefined {
        if(UserModel == undefined){
            return undefined
        }
        const user =  new User(
            UserModel.id,
            UserModel.name,
            UserModel.userName,
            UserModel.password,
            this.taskAdapter && 
                this.taskAdapter?.mapToDomainArray(UserModel.tasks)
        );
        return user;
    }

    public mapToDomainArray(userModels: UserModel[] | undefined): User[] | [] {
        if(!userModels) return [];
        return userModels.map(userModel => this.mapToDomain(userModel)) as User[];
    }
}