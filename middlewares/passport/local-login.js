const LocalStrategy = require('passport-local').Strategy
const { getCryptoPassword } = require('./crypto')
const app = require('express')()

module.exports = new LocalStrategy({
  usernameField : 'id',
  passwordField : 'password',
  passReqToCallback : true
}, 
async (req, id, password, done) => {
  try {
    const db = req.app.get('database')
    const query = `
    SELECT TOP (1)
      passwd AS password,
      salt,
      grade,
      name
    FROM
      gmaccount
    WHERE
      deleted = 0 AND loginId = '${id}'
    `
    const result = await db.execute('base_global',query)
    if (result.rowsAffected[0] < 1) return done(null, false, {message: `해당 사용자를 찾을  수 없습니다.`})
    
    const record = result.recordset[0]
    const dbPassword = record.password
    const salt = record.salt
    const grade = record.grade
    const fullName = record.name

    if ( grade === 0 ) {
      return done(null, false, {message: '가입 승인이 필요합니다'})
    }
    
    const cryptedPassword = await getCryptoPassword(password, salt)
    if (cryptedPassword != dbPassword) return done(null, false, {message: `비밀번호가 일치하지 않습니다.`})
    
    global.writeLog.info(`login success : ${id}`)
    const user = {id, grade, fullName}
    return done(null, user)
  } catch (err) {
    return done(err)
  }
 
})