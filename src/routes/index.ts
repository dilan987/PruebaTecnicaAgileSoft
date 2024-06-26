import { Router } from 'express';
import glob from 'glob';

export function registerRoutes(router: Router): void {
    const routes = glob.sync(`${__dirname}/**/*.route.*`);
    routes.map(route => register(route, router));
}


function register(routePath: string, router: Router) {
    const { register } = require(routePath) as { register: (router: Router) => void };
    register(router);
}
