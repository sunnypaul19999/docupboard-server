import multer, { diskStorage } from 'multer';
import { v4 as uuidV4 } from 'uuid';
import { getFileRecord } from '../service/fileRecord.service.mjs';

const storage = diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.FILE_UPLOAD_DIR);
    },
    filename: async (req, file, cb) => {
        const genFilename = () => uuidV4() + '-' + Date.now();

        const userEmail = req.session.user.user_id ?? 'hiensunberg@gmail.com';
        let fileStorageName = genFilename();
        while (await getFileRecord(user_id, fileStorageName)) {
            console.log('generating filename ' + fileStorageName);
            fileStorageName = genFilename();
        }

        // const filetype = file.originalname.substring(file.originalname.indexOf('.'))
        cb(null, fileStorageName);
    }
});

const fileUpload = multer({ storage: storage });

export { fileUpload };