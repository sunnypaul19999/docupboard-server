import { Router } from "express";
import fileSystem from 'fs';
import { multiPartFormFileUploadParser } from "../middleware/multer.mjs";
import { addFileRecord, getFileRecord, getUserFileRecords } from "../service/fileRecord.service.mjs";


function verifyUserAuth(req, res, next) {
    // console.log({ isSessionPopulated: req.session.isPopulated, session: req.session });
    if (req.session.isPopulated) {
        if (req.session.user.user_id) {
            next();
            return;
        }
    }

    res.sendStatus(403);
}

const userFileRouter = Router();
userFileRouter.use('/user/file', verifyUserAuth);


async function userFileUpload(req, res) {
    // console.log({ file_upload: req.file });
    const userId = req.session.user.user_id;
    const originalname = req.file.originalname.substring(0, req.file.originalname.indexOf('.'));
    const fileType = req.file.originalname.substring(req.file.originalname.indexOf('.') + 1);
    const fileRecord = await addFileRecord(
        userId,
        req.file.filename,
        originalname,
        parseInt(req.file.size),
        fileType,
        req.file.path
    );
    // console.log('file uploaded');
    res.send(fileRecord);
}
userFileRouter.post('/user/file/upload', multiPartFormFileUploadParser, userFileUpload);

async function userFileDownload(req, res) {
    const fileRecordId = req.params.fileRecordId;
    const userId = req.session.user.user_id;
    // console.log(fileRecordId);
    if (fileRecordId) {
        const fileRecord = await getFileRecord(userId, fileRecordId);
        if (fileRecord) {

            const filePath = fileRecord.file_path;
            // console.log(filePath);
            const stat = fileSystem.statSync(filePath);

            res.writeHead(200, {
                'Content-Length': stat.size,
                'Content-Disposition': `attachment; filename = ${fileRecord.file_name}.${fileRecord.file_type}`
            });

            const readStream = fileSystem.createReadStream(filePath);
            readStream.pipe(res);
        } else {
            //when file with 'file_record_id' w.r.t to the 'user_id'
            //404 not found is sent
            res.sendStatus(404);
        }
    } else {
        res.sendStatus(400);
    }
}
userFileRouter.get('/user/file/download/:fileRecordId', userFileDownload);

async function userFiles(req, res) {
    try {
        const userId = req.session.user.user_id;
        const userFileRecords = await getUserFileRecords(userId);
        console.log(userId);
        res.json(userFileRecords);
    } catch (err) {
        console.log(err);
    }
}
userFileRouter.get('/user/file/all', userFiles);

export { userFileRouter };