import { Router } from 'express';
import cookieSession from "cookie-session";
import { googleOAuthRouter } from './google.oauth.mjs';

const oauthRouter = Router();
oauthRouter.use(
    '/user/login/oauth/2/google',
    cookieSession({
        name: 'oauthVerfiedUser',
        secret: uuid.v4(),
        maxAge: 3 * 24 * 60 * 60 * 100,
        path: '/',
        sameSite: 'strict',
        httpOnly: true
    }),
    googleOAuthRouter
);

export { oauthRouter };
