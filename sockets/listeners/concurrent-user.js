//@ts-check
'use strict'

const dbManager = require(global.appRoot + '/sql/db-manager')
const moment = require('moment')

const webReq = 'concurrent_user_req' //프론트엔드로부터 동접현황 요청
const webRes = 'concurrent_user_res' //프론트엔드에 동접현황 응답
const proxyReq = 'concurrent_user_proxy_req' //프록시서버에 동접현황 요청
const proxyRes = 'concurrent_user_proxy_res' //프록시서버로부터 동접현황 응답

module.exports = (client, io, manager) => {
  client.on(proxyRes, async (serverGroupId, amount, sender, time) => {
    try {
      console.log(`${serverGroupId}, ${amount}, ${sender}, ${time}`)
      if (true) {//if (sender === 'backend_concurrent') {
        const query = 
        `INSERT INTO concurrent_user
          (serverGroupId, userAmount, checkTime, regTime)
        VALUES
          (${serverGroupId}, ${amount}, '${time}', GETDATE())`
               
        global.writeLog.info(`response concurrent user ~ ${serverGroupId}, ${amount}, ${time} ~`)
        const result = await dbManager.execute('base_gm_log', query)
    
        if (result.rowsAffected === 0) {
          throw new Error('요청이 실패하였습니다.')
        }
      }

    } catch(err) {
      console.log(err.message)
    }
  })


  client.on(webReq, (data) => {
    
    global.writeLog.info(webReq)

    if (!manager.checkGrade(client, 1)) return

    //웹요청 데이터 유효성 확인 및 데이터 출력
    // if (data?.servers?.length === 0) {
    // manager.notify(client.id, false, '비정상적인 요청입니다.')
    // return;
    // }

    //global.writeLog.info(`servers: ${data.servers.join(',')}`)

    //프록시서버에 요청
    const hour = moment().format('YYYY-MM-DD HH:mm:ss')

    data.sender = data.name//'backend_concurrent'
    data.time = hour;

    manager.getProxy()?.emit(proxyReq, data)
  })
}