'use strict'

require('./env')
const path = require('path')
const process = require('process')
const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')
require('express-async-errors')

const logger = require('./utils/logger')

const middleware = require('./middlewares')
const route = require('./routes')
const socketManager = require('./sockets')

const startDatabase = require('./sql')
const exl = require('./exl')
const numDef = require('./utils/num-def')
const strDef = require('./utils/str-def')
const { getServerName, getWorldNumber, getServerGroupId, getServerGroupList } = require('./utils/function')
const cors = require('cors')

const startScheduling = require('./schedules')

const corsOptions = {
    origin: 'http://localhost:5500',
    optionsSuccessStatus: 200
}

class App {
    constructor () {
        if (!App.instance) {
            this.setGlobal()
            this.app = express();
            this.app.use(cors({
                origin:[
                    'http://localhost:3103',
                    'http://10.10.9.210:3103',
                    `http://${process.env.IP}:${process.env.CLIENT_PORT}`
                    //접속을 허용할 ip 추가
                ],
                credentials: true
            }));
            this.httpServer = createServer(this.app)
            this.io = new Server(this.httpServer, {
                cors: {
                    origin: [
                        `http://localhost:3103`, 
                        'http://127.0.0.1:3103',  //qa-private
                        'http://20.249.5.188:3103', //qa-public
                        'http://127.0.0.1:3103',  //live-private
                        'http://20.214.162.82:3103', //live-public
                        'http://10.10.9.210:3103',
                        `http://${process.env.IP}:${process.env.CLIENT_PORT}`
                    ], // 허용할 호스트
                    methods: ['GET', 'POST'] // 허용할 HTTP 메소드 정의
                }
            })
            this.app.set('rootPath', path.resolve(__dirname).replace(/\\/g, '/'))
            App.instance = this;
        }
        return App.instance
    }

    async ready() {
        //this.setStatic()
        //this.setLocals()
        await startDatabase(this.app)
        await middleware(this.app)
        this.setListener()
        this.errorHandler()
        startScheduling()
    }

    async close(){

    }

    setGlobal() {
        global.appRoot = path.resolve(__dirname).replace(/\\/g, '/')
        global.numDef = numDef
        global.strDef = strDef
        global.ErrorTypes = require('./errors')
        global.writeLog = logger
        global.gameData = exl
        global.getServerName = getServerName;
        global.getWorldNumber = getWorldNumber;
        global.getServerGroupId = getServerGroupId;
        global.getServerGroupList = getServerGroupList;
    }
    
    // 정적 디렉토리 추가
    setStatic (){
        this.app.use('/public', express.static('public'));
    }

    // 로컬 변수
    setLocals(){
        // 템플릿 변수
        this.app.use( (req, res, next) => {
            this.app.locals.isLogin = true;
            this.app.locals.req_path = req.path;
            next();
        });
    }

    // 이벤트 리스너
    setListener (){
        route(this.app)
        socketManager.accept(this.io)
    }

    errorHandler() {
        // // 404 페이지를 찾을수가 없음
        this.app.use( ( req , res, _ ) => {
            res.status(404).send({
                result: 'failed',
                name: 'Page not found',
                message: '페이지를 찾을 수 없습니다.'
            })
            global.writeLog.error('페이지를 찾을 수 없습니다.')
        });

        this.app.all('*', (res, req) => {
            res.send({
                result: 'failed',
                name: 'Page not found',
                message: '페이지를 찾을 수 없습니다.'
            })
            global.writeLog.error('페이지를 찾을 수 없습니다.')
        })

        this.app.use( (err, req, res,  _ ) => {
            res.status(err.status || 500)
            .send({
                result: err.status || 500,
                name: err.name || 'Internal Server Error',
                message: err.message || '서버 내부에서 오류가 발생했습니다.'
            })
            console.trace(err.stack)
            global.writeLog.error(err.message)
        });

        process.on('unhandledRejection', (reason, promise) => {
            global.writeLog.error('unhandledRejection:', reason)
        })
    }
}

const application = new App()
Object.freeze(application)

module.exports = application;