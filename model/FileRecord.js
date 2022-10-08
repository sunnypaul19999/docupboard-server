const mysqlClient = require('../config/Database').mysqlClient;
const mysqlConfig = require('../config/Database').mysqlConfig;

async function getFileRecordTable() {
    return mysqlClient.getSession().then(async (session) => {
        const schema = session.getSchema(mysqlConfig.schema.name);
        return schema.getTable(mysqlConfig.schema.table.file_record);
    });
}

async function addFileRecord(userId, fileStorageName, fileName, fileSize, fileType, filePath) {
    const userTable = await getFileRecordTable();
    // console.log(userId, fileStorageName, fileName, fileSize, fileType);
    // const user = await getUser(username);

    return await userTable
        .insert("user_id", "file_storage_name", "file_name", "file_size", "file_type", "file_path")
        .values(userId, fileStorageName, fileName, fileSize, fileType, filePath)
        .execute()
        .then(async (res) => {
            return await getFileRecord(userId, fileStorageName);
        });
}

async function getFileRecord(userId, fileStorageName) {
    const userTable = await getFileRecordTable();
    console.log(userId + ' ' + fileStorageName);
    return userTable
        .select("user_id", "file_record_id", "file_storage_name", "file_name", "file_size", "file_type", "file_path")
        .where('user_id = :userId and file_storage_name = :fileStorageName')
        .bind('userId', userId)
        .bind('fileStorageName', fileStorageName)
        .execute()
        .then(res => {
            const result = res.fetchOne();
            if (result) {
                return {
                    user_id: result[0],
                    file_record_id: result[1],
                    file_storage_name: result[2],
                    file_name: result[3],
                    file_size: result[4],
                    file_type: result[5],
                    file_path: result[6]
                };
            } else {
                return null;
            }
        });
}

async function getAllFileRecordOfUser(userId) {
    const userTable = await getFileRecordTable();

    return userTable
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
                        file_storage_name: row[2],
                        file_name: row[3],
                        file_size: row[4],
                        file_type: row[5],
                        file_path: row[6]
                    };
                })

            } else {
                result = [];
            }

            return result;
        });
}

module.exports.getFileRecord = getFileRecord;
module.exports.getAllFileRecordOfUser = getAllFileRecordOfUser;
module.exports.addFileRecord = addFileRecord;