'use strict'

const express = require('express')
const session = require('express-session')
const process = require('process')
const fileStore = require('session-file-store')(session)

const loadSession = (app) => {
    console.log('use session')
    let config = {
        secret: process.env.SECRET_KEY, //암호화 하는데 쓰일 키
        resave: false, // 세션에 변경 사항이 없어도 항상 다시 저장할지 여부
        saveUninitialized: false, // 초기화 되지 않은 세션을 스토어(저장소)에 강제로 저장할 지 여부
        cookie: {  // 세션 쿠키 설정(세션 관리 시 클라이언트에 보내는 쿠키)
            httpOnly: true, // true이면 클라이언트 자바스크립트에서 document.cookie로 쿠키 정보를 볼 수 없음
            secure: false, // true이면 https 환경에서만 쿠키 정보를 주고 받도록 처리
            maxAge: 1000 * 60 * 60 * 24// 쿠키 유효시간 1일
        },
    }
    // if (process.env.NODE_ENV === 'production')
    // {
    //     config.store = new fileStore() // 세션 저장소로 fileStor 사용
    // }
    app.use(session(config))
}

module.exports = loadSession