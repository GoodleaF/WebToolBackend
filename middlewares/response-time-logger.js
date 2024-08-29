'use strict'

const express = require('express')()
const responseTime = require('response-time')
const appRoot = require('app-root-path')

function logTimedOut(req, res, time) {
    if (time > 3000) { // response 3초 이상이면 log 남김
        global.writeLog.warn(`Timeout! ${req.method} [${req.url}]: ${time}`)
    }
}

const loadResponseTimeLogger = async (app) => {
    console.log('use ResponseTimeLogger')
    app.use(responseTime(logTimedOut))
}

module.exports = loadResponseTimeLogger