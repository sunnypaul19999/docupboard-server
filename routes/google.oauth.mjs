import express from 'express';
import qs from 'qs';
import axios from 'axios';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import cookieSession from 'cookie-session';
import { addUser } from '../service/user.service.mjs';

dotenv.config();

const googleOAuthRouter = express.Router();

async function getGoogleUserInfo(idToken, accessToken) {
    const url = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json';
    //appending the access_token to the url
    const requestURL = `${url}&access_token=${accessToken}`;
    try {
        const userInfoRes = await axios.get(requestURL, {
            withCredentials: true,
            headers: {
                //passing the id_token
                'Authorization': `Bearer ${idToken}`
            }
        });
        console.log(userInfoRes.data);
        return userInfoRes.data;
    } catch (err) {
        console.log(err, 'failed to get user info');
    }
}

function getGoogleOAuthAuthTokenExchangeBody(authorizationCode) {
    //defined in 'https://developers.google.com/identity/protocols/oauth2/web-server#httprest_1'
    const params = {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code: authorizationCode,
        grant_type: 'authorization_code',
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    };

    //url encoded string needed to be passed on request to
    //'https://oauth2.googleapis.com/token' in the body
    //thus returning url encoded string of params
    return qs.stringify(params);
}

async function onGoogleCallback(req, res) {
    console.log(req.query);
    try {
        const url = 'https://oauth2.googleapis.com/token';
        const googleOAuthAuthTokenBody = getGoogleOAuthAuthTokenExchangeBody(req.query.code);
        //request must of type 'post'
        //passing url endcoded of required params and setting appr headers
        //according to 'https://developers.google.com/identity/protocols/oauth2/web-server#httprest_1'
        /*
        response on call to 'https://oauth2.googleapis.com/token':
            {
                access_token: "",
                expires_in: 3599,
                scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid",
                token_type: "Bearer",
                id_token: ""
            }
        */
        const oauthRes = await axios.post(url, googleOAuthAuthTokenBody, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        /*{
            id: "113211975703774766613",
            email: "hiensunberg@gmail.com",
            verified_email: true,
            name: "Hiensunberg Waters",
            given_name: "Hiensunberg",
            family_name: "Waters",
            picture: "https://lh3.googleusercontent.com/a/ALm5wu0MZMPp5hCdsHhCDW1lunHHo_XyDIzoy4mcQp5P=s96-c",
            locale: "en-GB"
        }*/
        const userInfo = await getGoogleUserInfo(oauthRes.data.id_token, oauthRes.data.access_token);
        //on successfull login setting the user id in cookie
        try {
            const user = await addUser(userInfo.email);
            // console.log(user);

            //setting cookie value to 'oauthVerfiedUser'
            req.session.user = user;

            //directing user to user file upload page
            res.redirect('http://localhost:3000/view/files');
        } catch (err) {
            res.sendStatus(500);
        }

    } catch (err) {
        console.log(err, 'failed to exchange auth token');
    }
}

googleOAuthRouter.get('/redirect', onGoogleCallback);

export { googleOAuthRouter }