//@ts-check
'use strict'

const webReq = 'kick_all_req'
const webRes = 'kick_all_res'
const proxyReq = 'kick_all_proxy_req'
const proxyRes = 'kick_all_proxy_res'

module.exports = (client, io, manager) => {

  client.on(webReq, (data) => {
    global.writeLog.info(webReq)
    if (!manager.checkGrade(client, 4)) return

    global.writeLog.info(`servers: ${global.getServerGroupList()}`)

    data.sender = data.name;
    data.serverGroupId = global.getServerGroupList();

    manager.getProxy()?.emit(proxyReq, {serverGroupId: global.getServerGroupList()})
  })

  client.on(proxyRes, (server, message) => {
    global.writeLog.info(`server:${server}, message:${message}`)
    client.broadcast.emit(webRes, server, message)
  })
}