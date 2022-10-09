import { mysqlConfig, mysqlClient } from '../config/database.config.mjs';
import { v4 as uuidV4 } from 'uuid';

async function getUserTable() {
    const mysqlSession = await mysqlClient.getSession();
    const schema = mysqlSession.getSchema(mysqlConfig.schema.name);
    const table = schema.getTable(mysqlConfig.schema.table.user)
    return [mysqlSession, table];
}

async function queryUsers() {
    const [mysqlSession, userTable] = await getUserTable();

    return userTable
        .select("user_id", "user_email")
        .execute()
        .then(res => {
            let result = res.fetchAll();
            if (result) {
                result = result.map(row => {
                    return {
                        user_id: row[0],
                        user_email: row[1]
                    };
                });
            } else {
                result = [];
            }

            return result;
        }).finally(() => {
            mysqlSession.close();
        });
}

async function queryUserByEmail(userEmail) {
    const [mysqlSession, userTable] = await getUserTable();

    return userTable
        .select("user_id", "user_email")
        .where('user_email = :user_email')
        .bind('user_email', userEmail)
        .execute()
        .then(res => {
            const result = res.fetchOne();
            if (result) {
                return {
                    user_id: result[0],
                    user_email: result[1]
                };
            } else {
                return null;
            }
        }).finally(() => {
            mysqlSession.close();
        });
}

async function queryUserById(userId) {
    const [mysqlSession, userTable] = await getUserTable();

    return userTable
        .select("user_id", "user_email")
        .where('user_id = :userId')
        .bind('userId', userId)
        .execute()
        .then(res => {
            const result = res.fetchOne();
            if (result) {
                return {
                    user_id: result[0],
                    user_email: result[1]
                };
            } else {
                return null;
            }
        }).finally(() => {
            mysqlSession.close();
        });
}

async function persistUserIfNotExists(userEmail) {
    const [mysqlSession, userTable] = await getUserTable();

    const user = await queryUserByEmail(userEmail);

    if (user == null) {
        return await userTable
            .insert("user_id", "user_email")
            .values(uuidV4(), userEmail)
            .execute()
            .then(async () => await queryUserByEmail(userEmail))
            .finally(() => {
                mysqlSession.close();
            });
    }

    return user;
}

export { queryUserByEmail, queryUsers, queryUserById, persistUserIfNotExists };