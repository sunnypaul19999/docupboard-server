const mysqlx = require('@mysql/xdevapi');
const mysqlConfig = {
    connection: {
        user: process.env['DATABASE_USERNAME'],
        password: process.env['DATABASE_PASSWORD'],
        host: process.env['DATABASE_HOST'],
        port: parseInt(process.env['DATABASE_PORT']),
    },
    schema: {
        name: 'filevault',
        table: {
            user: 'user',
            file_record: 'file_record'
        }
    }
}

//freezing databaseConfig object from further modifications
Object.freeze(mysqlConfig);

const mysqlClient = mysqlx.getClient(mysqlConfig.connection, {
    pooling: {
        enabled: true,
        maxSize: 200
    }
});

module.exports.mysqlConfig = mysqlConfig;
module.exports.mysqlClient = mysqlClient;