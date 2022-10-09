import { Router } from "express";
import { multiPartFormFileUploadParser } from "../middleware/multer.mjs";
import { addFileRecord, getFileRecord } from "../service/fileRecord.service.mjs";

function verifyUserAuth(req, res, next) {
    // console.log({ isSessionPopulated: req.session.isPopulated, session: req.session });
    if (req.session.isPopulated) {
        next();
    } else {
        res.sendStatus(401);
    }
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
    if (fileId) {
        const fileRecord = await getFileRecord(userId, fileRecordId);
        if (fileRecord) {

            const filePath = fileRecord.file_path;
            const stat = fileSystem.statSync(filePath);

            res.writeHead(200, {
                'Content-Length': stat.size,
                'Content-Disposition': `attachment; filename = ${fileRecord.file_name}.${fileRecord.file_type}`
            });

            const readStream = fileSystem.createReadStream(filePath);
            readStream.pipe(res);
        } else {
            //when file with 'file_record_id' wrt to the 'user_id'
            //404 not found is sent
            res.sendStatus(404);
        }
    } else {
        res.sendStatus(400);
    }
}
userFileRouter.post('/user/file/download/:fileRecordId', userFileDownload);

function userFiles(req, res) { }
userFileRouter.post('/user/file/all', userFiles);

export { userFileRouter };