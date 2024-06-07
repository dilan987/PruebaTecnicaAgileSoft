import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { TaskModel } from './task.model';
import { RelationshipKeys } from './relationship-config/user.relationship.config';

interface UserAttributes {
    id: string;
    name: string;
    userName: string;
    password: string;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> { }

export class UserModel extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: string;
    public name!: string;
    public userName!: string;
    public password!: string;


    // Many-to-Many associations
    public readonly tasks?: TaskModel [];

}



export const initUserModel = async () => {
    try {
        UserModel.init(
            {
                id: {
                    field: 'Id',
                    type: DataTypes.UUIDV4,
                    allowNull: false,
                    primaryKey: true,
                    defaultValue: DataTypes.UUIDV4
                },
                name: {
                    field: 'Name',
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                userName: {
                    field: 'UserName',
                    type: DataTypes.TEXT,
                    allowNull: false
                },
                password: {
                    field: 'Password',
                    type: DataTypes.TEXT,
                    allowNull: false
                }
            },
            {
                sequelize: sequelize,
                tableName: 'Users',
                freezeTableName: true,
                timestamps: false,
                underscored: false
            },
        );

    } catch (error) {
        console.log(error)
    }
}