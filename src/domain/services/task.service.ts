import { Task } from 'domain/entities/task.ent';
import { v4 as uuidv4 } from 'uuid';


export class TaskDomainService {
    public creatEmptyEntity(): Task {
        return new Task(
            uuidv4(),
            '',
            '',
            false,
            '',
        );
    }
}