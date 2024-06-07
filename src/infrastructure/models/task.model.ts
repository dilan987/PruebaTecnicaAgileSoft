import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';


interface TaskAttributes {
    id: string;
    userId: string;
    name: string;
    status: boolean;
    description: string;
}

export interface TaskCreationAttributes extends Optional<TaskAttributes, 'id'> { }

export class TaskModel extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
    public id!: string;
    public userId!: string;
    public name!: string;
    public status!: boolean;
    public description!: string;

    // timestamps!
    public readonly createdOn!: Date;
    public readonly updatedOn!: Date;


}



export const initTaskModel = async () => {
    try {
        TaskModel.init(
            {
                id: {
                    field: 'Id',
                    type: DataTypes.UUIDV4,
                    allowNull: false,
                    primaryKey: true,
                    defaultValue: DataTypes.UUIDV4
                },
                userId: {
                    field: 'UserId',
                    type: DataTypes.TEXT,
                    allowNull: false,
                    
                },
                name: {
                    field: 'Name',
                    type: DataTypes.TEXT,
                    allowNull: false
                },
                status: {
                    field: 'Status',
                    type: DataTypes.BOOLEAN,
                    allowNull: false
                },
                description: {
                    field: 'Description',
                    type: DataTypes.TEXT,
                    allowNull: true,
                }
            },
            {
                sequelize: sequelize,
                tableName: 'Tasks',
                freezeTableName: true,
                timestamps: true,
                underscored: false,
                createdAt: 'CreatedOn',
                updatedAt: 'UpdatedOn'
            },
        );

    } catch (error) {
        console.log(error)
    }
}