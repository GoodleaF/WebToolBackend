//@ts-check
'use strict'

const webReq = 'accept_login_req'
const webRes = 'accept_login_res'
const proxyReq = 'accept_login_proxy_req'
const proxyRes = 'accept_login_proxy_res'

module.exports = (client, io, manager) => {

  client.on(webReq, () => {
    global.writeLog.info(webReq)
    if (!manager.checkGrade(client, 4)) return

    manager.getProxy()?.emit(proxyReq, {sender: client.id})
  })

  client.on(proxyRes, (server, message) => {
    global.writeLog.info(`server:${server}, message:${message}`)
    client.broadcast.emit(webRes, server, message)
  })
}