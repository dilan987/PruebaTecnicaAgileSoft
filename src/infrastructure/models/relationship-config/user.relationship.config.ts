import { TaskModel, initTaskModel } from "../task.model";


interface RelationshipConfig {
    [key: string]: {
        nested: boolean;
        model: any;
        through: string;
        foreignKey: string;
        otherKey: string;
        timestamps: boolean;
        as: string[];
        init: (initRelations: boolean, config: { [key in RelationshipKeys]: boolean }) => Promise<void>;
    };
}

export const userRelationshipConfig: RelationshipConfig = {
    task: {
        nested: false,
        model: TaskModel,
        through: '',
        foreignKey: 'Id',
        otherKey: 'UserId',
        timestamps: false,
        as: ['task'],
        init: initTaskModel
    }
};

export type RelationshipKeys = keyof typeof userRelationshipConfig;