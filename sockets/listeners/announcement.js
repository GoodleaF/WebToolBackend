//@ts-check
'use strict'

const webReq = 'server_announcement_req'
const webRes = 'server_announcement_res'
const proxyReq = 'server_announcement_proxy_req'
const proxyRes = 'server_announcement_proxy_res'

module.exports = (client, io, manager) => {
  client.on(webReq, (data) => {
    global.writeLog.info(webReq)

    if (!manager.checkGrade(client, 1)) return
    
    if (data?.servers?.length === 0 || data.keyword == '') {
      manager.notify(client.id, false, '비정상적인 요청입니다.')
      return;
    }

    global.writeLog.info(`message: ${data.keyword}`)
    global.writeLog.info(`servers: ${data.servers.join(',')}`)

    data.servers.forEach((server)=> {
      console.log(server)
      var result = global.getServerGroupId(server)
      data.serverGroupId.push(result)
    })
    console.log(data.serverGroupId)
    data.sender = data.name

    manager.getProxy()?.emit(proxyReq, data)
  })

  client.on(proxyRes, (server, sender, message) => {
    global.writeLog.info(proxyRes)

    global.writeLog.info(`server:${server}, sender:${sender}, message:${message}`)
  })
}