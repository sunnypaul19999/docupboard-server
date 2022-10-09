import { Router } from "express";
import { fileUpload } from "../middleware/multer.mjs";

function verifyUserAuth(req, res, next) {
    console.log(req.session?.user);
    if (req.session?.user) { next(); }
    else {
        res.sendStatus(401);
    }
}

const userRouter = Router();
userRouter.use('/user/file', verifyUserAuth);


function userFileUpload(req, res) { }
userRouter.post('/upload', fileUpload, userFileUpload);

function userFileDownload(req, res) { }
userRouter.post('/download/:fileId', userFileDownload);

function userFiles(req, res) { }
userRouter.post('/all', userFiles);