//@ts-check
'use strict'

const mariadb = require('mariadb');
const mssql = require('mssql');

class DBManager {

    constructor()
    {
        this.pools = new Map()
    }

    setPool(name, config) {
        if (!this.pools.has(name)) {
            if (!config) {
                throw new Error('Pool does not exist');
            }
            const pool = new mssql.ConnectionPool(config);
            // automatically remove the pool from the cache if `pool.close()` is called
            const close = pool.close.bind(pool);
            pool.close = (...args) => {
                this.pools.delete(name);
                return close(...args);
            }
            this.pools.set(name, pool);
        }
    }
    
    getPool(name) {
        return this.pools.get(name);
    }
    
    async execute(name, sql) {
        try {
            const conn = await this.getPool(name).connect()
            return conn.request().query(sql)
            }
            catch(error){
                console.error('Error: ${name}: ', error)
                throw error;
            }
    }

    async request(name) {
        const conn = await this.getPool(name).getConnection();
        return conn.request();
    }

    async bulk(name, table) {
        const conn = await this.getPool(name).getConnection();
        return await conn.bulk(table)
    }
    
    closeAll() {
        Promise.all(
            Array.from(this.pools.values()).map((conn) => {
                return conn.exist().then((pool) => pool.close());
            })
        )
    }
}

const dbManager = new DBManager()

module.exports = dbManager