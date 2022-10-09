import multer, { diskStorage } from 'multer';
import { v4 as uuidV4 } from 'uuid';
import { getFileRecord } from '../service/fileRecord.service.mjs';

const storage = diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.FILE_UPLOAD_DIR);
    },
    filename: async (req, file, cb) => {
        const userId = req.session.user.user_id;
        const genFilename = () => uuidV4() + '-' + Date.now();
        let fileStorageName = genFilename();

        while (await getFileRecord(userId, fileStorageName)) {
            console.log('generating filename ' + fileStorageName);
            fileStorageName = genFilename();
        }

        cb(null, fileStorageName);
    }
});

const multiPartFormFileUploadParser = multer({ storage: storage }).single('fileUpload');
export { multiPartFormFileUploadParser };