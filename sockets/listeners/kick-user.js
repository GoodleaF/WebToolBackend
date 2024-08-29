//@ts-check
'use strict'

const webReq = 'kick_user_req'
const webRes = 'kick_user_res'
const proxyReq = 'kick_user_proxy_req'
const proxyRes = 'kick_user_proxy_res'

module.exports = (client, io, manager) => {

  client.on(webReq, (data) => {
    global.writeLog.info(webReq)
    if (!manager.checkGrade(client, 2)) return

    data.sender = data.name

    var serverGroupId = global.getServerGroupId(data.server);
    data.serverGroupId = [serverGroupId, ];
    data.accountId = Number(data.accountId)

    global.writeLog.info(`server:${data.server}, accountId:${data.accountId},
    ${data.serverGroupId}, ${global.getServerGroupId(data.server)}`)

    manager.getProxy()?.emit(proxyReq, data)
  })

  client.on(proxyRes, (server, message) => {
    client.broadcast.emit(webRes, server, message)
  })
}