'use strict'
const app = require('express')()
const dbManager = require(appRoot + '/sql/db-manager')

async function selectSkinscapeKey(req, res) {
  const {searchAll, beginDate, endDate} = req.query

  let query = 
  `SELECT
    message, server, name, regDate
  FROM
    dynamicskinscape
  `;

  if (searchAll === 'false') {
    query += ` WHERE regDate BETWEEN '${beginDate}' AND DATEADD(DAY, 1, '${endDate}')`;
  }
  query += ` ORDER BY idx DESC`;

  const result = await req.app.get('database').execute('base_gm_log', query)

  res.status(200).send({data: result.recordset})
}

async function insertSkinscapeKey(req, res) {
  const {message, servers, name} = req.body

  global.writeLog.info(`message:${message}, servers:${servers}, name:${name}`)

  let rowsAffected = 0;
  for (const server of servers.split(",")) {
    const query = `
    INSERT INTO 
      dynamicskinscape (message, server, name, regDate)
    VALUES
      ('${message}', '${server}', '${name}', GETDATE())
    `;
    const result = await req.app.get('database').execute('base_gm_log', query)
    rowsAffected += result.rowsAffected[0];
  }

  res.status(200).send({data: rowsAffected.recordset})
}

module.exports = {selectSkinscapeKey, insertSkinscapeKey}