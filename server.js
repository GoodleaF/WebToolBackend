//@ts-check
'use strict'

const application = require('./app');

async function startServer()
{
    await application.ready()
    global.writeLog.info('Start Server')
    application.httpServer?.listen(process.env.SERVER_PORT, ()=>{
        console.log('express listening on port', process.env.SERVER_PORT);
        //writeLog.info('server started');
    })
}

startServer()


// app.listen(process.env.SERVER_PORT, ()=>{
//     console.log('express listening on port', process.env.SERVER_PORT);
//     logger.info('server started');
// });

