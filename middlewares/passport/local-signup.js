const LocalStrategy = require('passport-local').Strategy
const { createCryptoPassword } = require('./crypto')
const app = require('express')()

module.exports = new LocalStrategy({
  usernameField: 'id',
  passwordField: 'password',
  passReqToCallback : true
},
async (req, id, password, done) => {
  try {
    const db = req.app.get('database')
    const check = await db.execute('base_global',`SELECT TOP 1 loginId FROM gmaccount WHERE loginId=?`, [id])
    
    if (check.rowsAffected[0] > 0) return done(null, false, {message: `The name already exist : ${id}`})
    
    const encryped = await createCryptoPassword(password)
    
    const query = 
    `
    INSERT INTO
    gmaccount ( loginId, passwd, sal, reg_dt)
    VALUES
      ('${id}', '${encryped.password}', '${encryped.salt}, CURRENT_TIMESTAMP')
    `
    const result = await db.execute(`base_global`,query)
    return done(null, {id, grade: 0})
  } catch (err) { 
    return done(err)
  }
})