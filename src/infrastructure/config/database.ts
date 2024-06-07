import { Sequelize } from "sequelize";
import { config } from 'dotenv';

config()

export const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    dialect: "postgres",
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "8700"),
    logging: false
});

export async function checkDatabaseConnection(): Promise<string> {
    try {
        // intentar autenticarse en la base de datos
        await sequelize.authenticate();
        return 'Conexión exitosa a la base de datos';
    } catch (error: any) {
        let err = new Error(error)
        return `Error al conectarse a la base de datos: ${error.message}`;
    }
}