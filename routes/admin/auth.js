'use strict'

const app = require('express')()
const dbManager = require(global.appRoot + '/sql/db-manager')
const passport = require('passport')
const { createCryptoPassword } = require(global.appRoot + '/middlewares/passport/crypto')

async function login(req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err)
        {
            global.writeLog.info("login failed ")
            console.log(err)
            return next(err);
        }
        if (!user) {
            return res.status(400).send({message: info.message})
        }
        
        global.writeLog.info(`로그인: ${user.fullName}(${user.grade})`)
        
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError)
                return next(loginError)
            }
            //return res.cookie('dsruser', user, {maxAge: 1000 * 60 * 60 * 24}).send({data : user})
            return res.send({data : user})
        })
    })(req, res, next)
}

async function logout(req, res, next) {
    req.logout(function(err) {
        if (err) {
            return next(err)
        }
        req.session.destroy()
        res.status(200).send('로그아웃 성공')
    });
}

async function signup(req, res) {
    const {id, password, fullName} = req.body
    global.writeLog.info(`signup ~ id:${id}, fullName:${fullName}`)
    const db = req.app.get('database')
    const check = await dbManager.execute('base_global',`SELECT TOP 1 loginId FROM gmaccount WHERE loginId='${id}'`)
    if (check.affectedRows > 0)
    {
        throw new global.ErrorTypes.ConflictError('이미 아이디가 있습니다.')
    }

    const encrypted = await createCryptoPassword(password)
    const query = 
    `
    INSERT INTO
        gmaccount ( loginId, passwd, salt, name, regDate)
    VALUES
        ('${id}', '${encrypted.password}', '${encrypted.salt}', '${fullName}',  CURRENT_TIMESTAMP)
    `
    const result = await dbManager.execute(`base_global`,query)
    
    if (result.rowsAffected > 0)
    {
        res.status(200).send('처리성공')
    } else { 
        throw new global.ErrorTypes.ConflictError('회원가입 처리가 실패하였습니다')
    }
}

async function changePasswd(req, res) {
    const {id, password, newPassword} = req.body
    
}


module.exports = {login, logout, signup}