'use strict'
const app = require('express')()
const dbManager = require(appRoot + '/sql/db-manager')

async function selectConcurrentUser(req, res) {
  const {date} = req.query

  const query = 
  `SELECT [serverGroupId], DATEPART(HOUR, checkTime) AS [time], MAX(userAmount) AS [amount]
  FROM concurrent_user
  WHERE CAST(checkTime AS DATE) = '${date}'
  GROUP BY serverGroupId, DATEPART(HOUR, checkTime)
  ORDER BY serverGroupId ASC, DATEPART(HOUR, checkTime) ASC
  `
  //여기서 serverGroupId는 커뮤니터서버의 그룹ID임;

  const result = await req.app.get('database').execute('base_gm_log', query)
  
  const reduced = result.recordset.reduce((arr, e)=>{
    if (!arr[e.serverGroupId]) {
      arr[e.serverGroupId] = { server: global.getServerName(e.serverGroupId), datas: Array(24).fill(0)};
    }
    arr[e.serverGroupId].datas[e.time] = e.amount;
    return arr;
  }, []);

  const filtered = reduced.filter(Boolean);
 
  res.status(200).send({data: filtered})
}


module.exports = {selectConcurrentUser}