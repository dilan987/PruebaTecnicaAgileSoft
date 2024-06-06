import { json, urlencoded } from 'body-parser';
import compress from 'compression';
import errorHandler from 'errorhandler';
import express, { Request, Response } from 'express';
import Router from 'express-promise-router';
import helmet from 'helmet';
import * as http from 'http';
import httpStatus from 'http-status';
import cookieParser from 'cookie-parser';

import { registerRoutes } from './routes';
import cors from 'cors';

export class Server {
    private readonly express: express.Express;
    private readonly port: string;
    private httpServer?: http.Server;

    constructor(port: string) {
        const corsOptions: cors.CorsOptions = {
            origin: function (origin, callback) {
                return callback(null, true);
            },
            exposedHeaders: ['auth-token'],
            credentials: true,
        };

        this.port = port;
        this.express = express();
        this.express.use(json({ limit: '500mb' }));
        this.express.use(urlencoded({ limit: '500mb', extended: true }));
        this.express.use(cookieParser())
        this.express.use(helmet.xssFilter());
        this.express.use(helmet.noSniff());
        this.express.use(helmet.hidePoweredBy());
        this.express.use(helmet.frameguard({ action: 'deny' }));
        this.express.use(compress());
        this.express.use(cors(corsOptions))
        const router = Router();
        router.use(errorHandler());
        this.express.use(router);

        registerRoutes(router);

        router.use((err: Error, req: Request, res: Response, _next: () => void) => {
            console.log(err);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message);
        });
    }

    async listen(): Promise<void> {
        return new Promise(resolve => {
            const env = this.express.get('env') as string;
            this.httpServer = this.express.listen(this.port, () => {
                console.log(
                    `  Backend App is running at http://localhost:${this.port} in ${env} mode`
                );
                console.log('  Press CTRL-C to stop\n');
                resolve();
            });
        });
    }

    getHTTPServer(): Server['httpServer'] {
        return this.httpServer;
    }

    async stop(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.httpServer) {
                this.httpServer.close(error => {
                    if (error) {
                        reject(error);

                        return;
                    }

                    resolve();
                });
            }

            resolve();
        });
    }
}