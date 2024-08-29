module.exports = {
    //account
    'base_game01': { //game-db-account
        user: '',
        password: '',
        database: 'base_game01',
        server: '127.0.0.1',
        port: 1433,
        pool: {
            max: 5,
            min: 0,
            idleTimeoutMillis: 30000
        },
        options: {
            encrypt: false, 
            trustServerCertificate: false 
        }
    },
    'base_game02': { //game-db-account
        user: '',
        password: '',
        database: 'base_game02',
        server: '127.0.0.1',
        port: 1433,
        pool: {
            max: 5,
            min: 0,
            idleTimeoutMillis: 30000
        },
        options: {
            encrypt: false, 
            trustServerCertificate: false 
        }
    },
    'base_community01': { //game-db-account
        user: '',
        password: '',
        database: 'base_community01',
        server: '127.0.0.1',
        port: 1433,
        pool: {
            max: 5,
            min: 0,
            idleTimeoutMillis: 30000
        },
        options: {
            encrypt: false, 
            trustServerCertificate: false 
        }
    },
    'base_global':{
        user: '',
        password: '',
        database: 'base_global',
        server: '127.0.0.1',
        port: 1433,
        pool: {
            max: 5,
            min: 0,
            idleTimeoutMillis: 30000
        },
        options: {
            encrypt: false, 
            trustServerCertificate: false 
        }
    },
    'base_gm_log':
    {
        user: '',
        password: '',
        database: 'base_gm_log',
        server: '127.0.0.1',
        port: 1433,
        pool: {
            max: 5,
            min: 0,
            idleTimeoutMillis: 30000
        },
        options: {
            encrypt: false, 
            trustServerCertificate: false 
        }
    }
}