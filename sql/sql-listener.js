const sql = require('mariadb')
const mssql = require('mssql')

mssql.on('error', err => {
    // ... error handler
})