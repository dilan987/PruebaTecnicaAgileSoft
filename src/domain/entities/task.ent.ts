

export class Task {
    public readonly id: string;
    public userId: string
    public name: string;
    public status: boolean;
    public description: string;
    public createdOn: Date;
    public updatedOn: Date;


    constructor(id: string, userId: string, name: string, status: boolean, description: string, createdOn: Date, updatedOn: Date) {
        this.id = id
        this.userId = userId
        this.name = name
        this.status = status
        this.description = description
        this.createdOn= createdOn
        this.updatedOn = updatedOn
    }
}