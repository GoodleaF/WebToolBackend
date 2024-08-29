//@ts-check
'use strict'

const cron = require('node-cron')
const moment = require('moment')
const appRoot = require('app-root-path')
const socketManager = require(appRoot.resolve('sockets'))

function executePerHour()
{
  try
  {
    const hour = moment().format('YYYY-MM-DD HH:mm:ss')
    socketManager.getProxy()?.emit('concurrent_user_proxy_req', {sender: 'backend_concurrent', time: hour})
    global.writeLog.info(`request concurrent user ~ ${moment().format('YYYY-MM-DD HH:mm')} ~`)
  } catch (err) {
    console.log(err.message)
  }
}

module.exports = function startScheduling() {
  //if (process.env.NODE_ENV !== 'production') return;
  console.log('startScheduling')
  const hourTask = cron.schedule('1 * * * *', executePerHour)
  
  hourTask.start()
}