// const mysqlx = require('@mysql/xdevapi');
// const mysqlConfig = require('../config/Database').mysqlConfig;
// const mysqlClient = mysqlx.getClient(mysqlConfig.connection, {
//     pooling: {
//         enabled: true,
//         maxSize: 200
//     }
// });

const mysqlClient = require('../config/Database').mysqlClient;
const mysqlConfig = require('../config/Database').mysqlConfig;

async function getUserTable() {
    return mysqlClient.getSession().then(async (session) => {
        const schema = session.getSchema(mysqlConfig.schema.name);
        return schema.getTable(mysqlConfig.schema.table.user);
    });
}

async function getUsers() {
    const userTable = await getUserTable();

    return userTable
        .select("user_id", "username", "access_token", "refresh_token")
        .execute()
        .then(res => {
            let result = res.fetchAll();
            if (result) {
                result = result.map(row => {
                    return {
                        user_id: row[0],
                        username: row[1],
                        // access_token: row[2],
                        // refresh_token: row[3],
                    };
                });
            } else {
                result = [];
            }

            return result;
        });
}

async function getUser(username) {
    const userTable = await getUserTable();

    return userTable
        .select("user_id", "username", "access_token", "refresh_token")
        .where('username = :username')
        .bind('username', username)
        .execute()
        .then(res => {
            const result = res.fetchOne();
            if (result) {
                return {
                    user_id: result[0],
                    username: result[1],
                    // access_token: result[2],
                    // refresh_token: result[3],
                };
            } else {
                return null;
            }
        });
}

async function addUser(userId, username, accessToken, refreshToken) {
    const userTable = await getUserTable();

    const user = await getUser(username);

    if (user == null) {
        return await userTable
            .insert("user_id", "username", "access_token", "refresh_token")
            .values(userId, username, accessToken, refreshToken ?? null)
            .execute()
            .then(async (res) => {
                return {
                    ...await getUser(username),
                    didExist: false
                };
            });
    } else {
        return await userTable
            .update()
            .where('username = :username')
            .bind('username', username)
            .set('access_token', accessToken)
            .execute()
            .then(async (res) => {
                return {
                    ...await getUser(username),
                    didExist: true
                };
            });
    }
}

// console.log('asfsf');
// const user = addUser('232232', 'sdfadf', 'q222221', 'sdafsd')
//     .then(res => {
//         console.log(res);
//     });

module.exports.getUsers = getUsers;
module.exports.getUser = getUser;
module.exports.addUser = addUser;