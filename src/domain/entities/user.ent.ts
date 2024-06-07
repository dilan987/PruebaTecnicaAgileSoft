import { Task } from "./task.ent";


export class User {
    public readonly id: string;
    public name: string;
    public userName: string;
    public password: string;
    private _userTaskInfo?: Task[] | undefined;


    constructor(id: string, name: string, userName: string, password: string, userTaskInfo: Task[] | undefined) {
        this.id = id
        this.name = name
        this.userName = userName
        this.password = password
        this._userTaskInfo = userTaskInfo || undefined
    }

    get userTaskInfo(): Task[] | undefined {
        return this._userTaskInfo;
      }
    
      set userTaskInfo(userTaskInfo: Task[] | undefined) {
        this._userTaskInfo = userTaskInfo;
      }
}