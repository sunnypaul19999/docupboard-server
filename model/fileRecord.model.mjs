import { mysqlClient } from '../config/database.config.mjs';
import { mysqlConfig } from '../config/database.config.mjs';
import { v4 as uuidV4 } from 'uuid';
import { getUserById } from '../service/user.service.mjs';

async function getFileRecordTable() {
    const mysqlSession = await mysqlClient.getSession();
    const schema = mysqlSession.getSchema(mysqlConfig.schema.name);
    const table = schema.getTable(mysqlConfig.schema.table.file_record)
    return [mysqlSession, table];
}

async function persistFileRecord(userId, fileStorageName, fileName, fileSize, fileType, filePath) {
    const [mysqlSession, fileRecordTable] = await getFileRecordTable();

    return await fileRecordTable
        .insert("user_id", "file_record_id", "file_storage_name", "file_name", "file_size", "file_type", "file_path")
        .values(userId, uuidV4().toString(), fileStorageName, fileName, fileSize, fileType, filePath)
        .execute()
        .then(async () => await queryFileRecord(userId, fileStorageName))
        .finally(() => {
            mysqlSession.close();
        });
}

async function queryFileRecord(userId, fileRecordId) {
    const [mysqlSession, fileRecordTable] = await getFileRecordTable();
    console.log(userId + ' ' + fileRecordId);
    return fileRecordTable
        .select("user_id", "file_record_id", "file_storage_name", "file_name", "file_size", "file_type", "file_path")
        .where('user_id = :userId and file_record_id = :fileRecordId')
        .bind('userId', userId)
        .bind('fileRecordId', fileRecordId)
        .execute()
        .then(res => {
            const result = res.fetchOne();
            if (result) {
                return {
                    user_id: result[0],
                    file_record_id: result[1],
                    // file_storage_name: result[2],
                    file_name: result[3],
                    file_size: result[4],
                    file_type: result[5],
                    file_path: result[6]
                };
            } else {
                return null;
            }
        })
        .finally(() => {
            mysqlSession.close();
        });
}

async function queryAllFileRecordOfUser(userId) {
    const [mysqlSession, fileRecordTable] = await getFileRecordTable();

    return fileRecordTable
        .select("user_id", "file_record_id", "file_storage_name", "file_name", "file_size", "file_type", "file_path")
        .where('user_id = :userId')
        .bind('userId', userId)
        .execute()
        .then(res => {
            let result = res.fetchAll();
            if (result) {
                result = result.map(row => {
                    return {
                        user_id: row[0],
                        file_record_id: row[1],
                        // file_storage_name: row[2],
                        file_name: row[3],
                        file_size: row[4],
                        file_type: row[5],
                        // file_path: row[6]
                    };
                })

            } else {
                result = [];
            }

            return result;
        })
        .finally(() => {
            mysqlSession.close();
        });
}

export { queryFileRecord, queryAllFileRecordOfUser, persistFileRecord };