import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieSession from "cookie-session";
import { v4 as uuidV4 } from 'uuid';

import { oauthRouter } from './routes/oauth.mjs';
import { userFileRouter } from './routes/user.file.mjs';

const server = express();

function serverInit() {
    dotenv.config();
    //placing middlewares
    // server.set('query parser', queryParser);
    // const whitelist = ['http://localhost:3000', 'http://localhost:7000', 'https://accounts.google.com'];
    server.use(
        '/api/v1',
        cors({
            origin: (origin, callback) => {
                callback(null, true)
            },
            methods: ['GET', 'POST'],
            credentials: true,
            maxAge: 3 * 60 * 60 * 1000
        }),
        cookieSession({
            name: 'oauthVerfiedUser',
            keys: ['helloworld'],
            maxAge: 3 * 24 * 60 * 60 * 1000,
            path: '/',
            sameSite: 'strict',
            httpOnly: true,
            signed: true
        }),
        oauthRouter,
        userFileRouter);
    server.listen(7000);
    console.log('listening on port 7000');
}

export { serverInit };