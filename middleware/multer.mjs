import multer, { diskStorage } from 'multer';
import { v4 as uuidV4 } from 'uuid';
import { getFileRecord } from '../model/FileRecord';

const storage = diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.FILE_UPLOAD_DIR);
    },
    filename: async (req, file, cb) => {
        const genFilename = () => uuidV4() + '-' + Date.now();

        const userId = req.session.userId ?? '113211975703774766613';
        let fileStorageName = genFilename();
        while (await getFileRecord(userId, fileStorageName)) {
            console.log('generating filename ' + fileStorageName);
            fileStorageName = genFilename();
        }

        // const filetype = file.originalname.substring(file.originalname.indexOf('.'))
        cb(null, fileStorageName);
    }
});

const fileUpload = multer({ storage: storage });

export { fileUpload };