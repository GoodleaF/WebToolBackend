'use strict'

class SocketManager {
    constructor() {
        if (!SocketManager.instance) {
            this.users = new Map();
            this.proxy = null;
        }
        SocketManager.instance = this;
        return SocketManager.instance;
    }

    accept(io) {
        global.writeLog.info('socketIO accepting...')
        
        io.on('connection', (client) => {
            global.writeLog.info(`${client.id} connected`);
            //연결시 handshake
            client.emit('hi', client.id , (handShakeData) => {
                this.registerUser(client, handShakeData)
            })
    
            //연결이 종료되었을 때
            client.on('disconnect', () => {
                this.deleteUser(client)
            })

            client.on('proxy_response_result', (sender, result, message)=> {
                this.notify(sender, result, message)
            })
    
            this.registerListeners(client, io)
        })
    }

    registerListeners(client, io) {
        require('./listeners/announcement')(client, io, socketManager)
        require('./listeners/dynamicskinscape')(client, io, socketManager)
        require('./listeners/kick-user')(client,io,socketManager)
        require('./listeners/kick-all')(client,io,socketManager)
        require('./listeners/concurrent-user')(client,io,socketManager)
        require('./listeners/accept-login')(client,io,socketManager)
    }

    registerUser(client, handShakeData) {
        global.writeLog.info(`[${handShakeData.name}(${handShakeData.grade})] register`)
        this.users.set(client.id, {name: handShakeData.name, grade: handShakeData.grade, client})
        if (handShakeData.name === 'proxy') {
            this.proxy = client;
        }
    }

    deleteUser(client) {
        global.writeLog.info(`${client.id} disconnected`)
        const user = this.getUser(client.id)
        if (user == null || user == undefined) return;
        
        global.writeLog.info(`[${user.name}(${user.grade})] unregister`)
        if (this.users[client.id]  === this.proxy) {
            this.proxy = null
        }
        this.users.delete(client.id);
    }

    getUser(userId) {
        return this.users.get(userId)
    }

    getProxy() { return this.proxy }

    notify(senderId, result, message) {
        const user = this.getUser(senderId)
        if (user == null) return;
        global.writeLog.info(`[${user.name}(${user.grade})] ${result}: ${message}`)
        user?.client?.emit('notify_result', {result, message})
    }

    checkGrade(client, accessableGrade) {
        const user = this.getUser(client.id)
        
        if (user == null) {
            this.notify(client.id, false, '로그인 되지 않았습니다. 다시 로그인후 시도해 주십시오')
            return false;
        }

        global.writeLog.info(`[${user.name}(${user.grade})]`)

        if (user.grade < accessableGrade) {
            this.notify(client.id, false, '액세스 권한이 없습니다. 등급이 낮습니다.')
            return false;
        }
        return true
    }
}

const socketManager = new SocketManager()

module.exports = socketManager