import { queryFileRecord, queryAllFileRecordOfUser, persistFileRecord } from '../model/fileRecord.model.mjs';

async function addFileRecord(userId, userEmail) {
    try {
        return await persistFileRecord(userId, userEmail);
    } catch (err) {
        console.error(err, 'failed to persist file record');
    }
}

async function getFileRecord(userEmail) {
    try {
        return await queryFileRecord(userEmail);
    } catch (err) {
        console.error(err, 'failed to get file record from persistent storage');
    }
}

async function getUserFileRecords(userId, userEmail) {
    try {
        return await queryAllFileRecordOfUser(userId, userEmail);
    } catch (err) {
        console.error(err, 'failed to persist file record');
    }
}

export { getFileRecord, getUserFileRecords, addFileRecord };
