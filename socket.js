
const socket = require('socket.io')

module.exports = (server) => {
    let io = socket(server, {
        cors: {
            origin: '*',
            method: ['GET', 'POST']
        }
    })

    io.on('connection', (socket) => {
        socket.on('connect', () => {
            console.log('User connected!')
        })

        socket.on('disconnect', () => {
            console.log('User disconnected!')
        })

        socket.on('notify', async (data) => {
            io.emit('notify', data)
        })
    })
}
