import { mysqlConfig, mysqlClient } from '../config/database.config.mjs';
import { v4 as uuidV4 } from 'uuid';

async function getUserTable() {
    return mysqlClient.getSession().then(async (session) => {
        const schema = session.getSchema(mysqlConfig.schema.name);
        return schema.getTable(mysqlConfig.schema.table.user);
    });
}

async function queryUsers() {
    const userTable = await getUserTable();

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
        });
}

async function queryUserByEmail(userEmail) {
    const userTable = await getUserTable();

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
        });
}

async function queryUserById(userId) {
    const userTable = await getUserTable();

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
        });
}

async function persistUserIfNotExists(userEmail) {
    const userTable = await getUserTable();

    const user = await queryUser(userEmail);

    if (user == null) {
        return await userTable
            .insert("user_id", "user_email")
            .values(uuidV4(), userEmail)
            .execute()
            .then(async () => await queryUser(userEmail));
    }

    return user;
}

export { queryUserByEmail, queryUsers, queryUserById, persistUserIfNotExists };