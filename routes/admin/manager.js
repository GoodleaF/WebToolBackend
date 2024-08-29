'use strict'

const app = require('express')()

exports.selectManager = async (req, res) => {
  const db = req.app.get('database')

  const query = 
  `
  SELECT
    loginId, name, grade, deleted, regDate
  FROM
  gmaccount
  ORDER BY regDate desc
  `
  const result = await db.execute(`base_global`,query)
  
  res.status(200).send({data: result.recordset})
}

exports.changeGrade = async (req, res) => {
  const {id, grade} = req.body

  global.writeLog.info(`id:${id}, grade:${grade}`)

  const db = req.app.get('database')

  const query = 
  `
  UPDATE gmaccount
  SET
    grade=${grade}
  WHERE
    loginId='${id}'
  `
  const result = await db.execute(`base_global`,query)
  if (result.rowsAffected === 0) {
    throw new global.ErrorTypes.BadRequestError('해당 아이디를 가진 회원이 없습니다.')
  }
  res.status(200).send({data: true, message: '처리성공'})
}

exports.deleteManager = async (req, res) => {
  const {id} = req.body
  global.writeLog.info(`id:${id}`)

  const db = req.app.get('database')

  const query = 
  `
  UPDATE gmaccount
  SET
    deleted=1
  WHERE
    loginId='${id}'
  `
  const result = await db.execute(`base_global`,query)
  if (result.rowsAffected[0] === 0) {
    throw new global.ErrorTypes.BadRequestError('해당 아이디를 가진 회원이 없습니다.')
  }
  res.status(200).send({data: true, message: '처리성공'})
}
