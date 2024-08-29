/*
    const dbManager = require(global.appRoot + '/sql/db-manager')
    req.app.get('database')

*/

//@ts-check
'use strict'

const app = require('express')()
const mariadb = require('mariadb')
const mssql = require('mssql')
const dbManager = require('./db-manager')

module.exports = async function startDatabase(app){
    global.writeLog.info('~~~start Database~~~ mode : ', process.env.NODE_ENV)
    const entries = Object.entries(
        process.env.NODE_ENV === 'production' ? require('./db-config-qa') :
        process.env.NODE_ENV === 'qa' ? require('./db-config-qa') :
        require('./db-config-development'))
    for (const [key, config] of entries)
    {
        global.writeLog.info(`${key}: ${config.host}`)
        dbManager.setPool(key, config)
    }
    global.writeLog.info('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    global.dbManager = dbManager
    app.locals.sql = mssql
    app.set('database', dbManager)
    //app.locals.query = query
}