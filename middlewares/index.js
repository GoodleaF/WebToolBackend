//@ts-check
'use strict'

const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const passport = require('passport')


const loadMorgan = require('./morgan');
const loadResponseTimeLogger = require('./response-time-logger')
const loadSession = require('./session')
const loadPassport = require('./passport')

const middleware = async (app) => {
    console.log('set Middlewares')
    // 미들웨어 셋팅
    
    app.use(cors(
        {
            origin: 
                [
                    `http://localhost:3103`, 
                    'http://127.0.0.1:3103',  //qa-private
                    'http://20.249.5.188:3103', //qa-public
                    'http://127.0.0.1:3103',  //live-private
                    'http://20.214.162.82:3103', //live-public
                    'http://10.10.9.210:3103'
                ],
            credentials: true
        }
    ))
    app.use(cookieParser(process.env.SECRET_KEY))
    app.use(express.json()) // for parsing application/json
    app.use(express.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded

    loadSession(app)
    
    loadPassport(app, passport)
    await loadMorgan(app)
    await loadResponseTimeLogger(app)
}

module.exports = middleware