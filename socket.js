const socket = require('socket.io')
const NotificationModel = require('./api/models/notification.model')

module.exports = (server) => {
   let io = socket(server, {
      cors: {
         origin: '*',
         method: ['GET', 'POST'],
      },
   })

   io.on('connection', (socket) => {
      socket.on('connect', () => {
         console.log('User connected!')
      })

      socket.on('disconnect', () => {
         console.log('User disconnected!')
      })

      socket.on('notify', async (data) => {
         const createResponse = await NotificationModel.createNotification(data)
         const notifyResponse = await NotificationModel.getNotificationsWhere({
            notification_id: createResponse[0],
         })
         io.emit('notify', notifyResponse[0])
      })
   })
}
