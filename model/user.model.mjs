import { mysqlConfig, mysqlClient } from '../config/database.config.mjs';

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

async function queryUser(userEmail) {
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

async function persistUserIfNotExists(userId, userEmail) {
    const userTable = await getUserTable();

    const user = await getUser(userEmail);

    if (user == null) {
        return await userTable
            .insert("user_id", "user_email")
            .values(userId, userEmail)
            .execute()
            .then(async () => await getUser(userEmail));
    }

    return user;
}

// console.log('asfsf');
// const user = addUser('232232', 'sdfadf', 'q222221', 'sdafsd')
//     .then(res => {
//         console.log(res);
//     });

// module.exports.getUsers = getUsers;
// module.exports.getUser = getUser;
// module.exports.addUserIfNotExists = addUserIfNotExists;

export { queryUser, queryUsers, persistUserIfNotExists };