//@ts-check
'use strict'

function checkLogin (req) {
  if (req.user === undefined || req.user === null)
  {
    throw new global.ErrorTypes.UnauthorizedError()
  }
}

function checkGrade (req, grade) {
  if (req.user.grade < grade) {
    throw new global.ErrorTypes.LowGradeError()
  }
}

function logging (req) {
  global.writeLog.info(`[${req.user.fullName}(${req.user.grade})] ${req.url}`)
}

exports.isLoggedIn = (req, res, next) => {
  checkLogin(req)
  next() //다음 미들웨어
}

exports.isNotLoggedIn = (req, res, next) => {
  if (req.user == false) {
    throw new global.ErrorTypes.NotAllowedMethodError()
    //todo : res.status(403).send(`잘못된 접근`)
  }
  next() //로그인 안되어 있다면 다음 미들웨어
}

exports.checkGrade0 = (req, res, next) => {
  checkLogin(req)
  checkGrade(req, 0)
  logging(req)
  next() //다음 미들웨어
}

exports.checkGrade1 = (req, res, next) => {
  checkLogin(req)
  checkGrade(req, 1)
  logging(req)
  next() //다음 미들웨어
}

exports.checkGrade2 = (req, res, next) => {
  checkLogin(req)
  checkGrade(req, 2)
  logging(req)
  next() //다음 미들웨어
}

exports.checkGrade3 = (req, res, next) => {
  checkLogin(req)
  checkGrade(req, 3)
  logging(req)
  next() //다음 미들웨어
}

exports.checkGrade4 = (req, res, next) => {
  checkLogin(req)
  checkGrade(req, 4)
  logging(req)
  next() //다음 미들웨어
}

exports.checkGrade5 = (req, res, next) => {
  checkLogin(req)
  checkGrade(req, 5)
  logging(req)
  next() //다음 미들웨어
}