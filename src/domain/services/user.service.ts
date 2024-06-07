import { User } from "../../domain/entities/user.ent";
import { v4 as uuidv4 } from 'uuid';


export class UserDomainService {
    public creatEmptyEntity(): User {
        return new User(
            uuidv4(),
            '',
            '',
            '',
            undefined
        );
    }
    
}