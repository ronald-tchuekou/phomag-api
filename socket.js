const socket = require('socket.io')
const { sendNotificationPush } = require('./api/config/notification')
const NotificationModel = require('./api/models/notification.model')
const RequestModel = require('./api/models/request.model')
const UserModel = require('./api/models/user.model')
const PrinterModel = require('./api/models/printer-service.model')

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
         NotifyUser(notifyResponse[0])
         io.emit('notify', notifyResponse[0])
      })
   })
}

async function NotifyUser(data) {
   if (data.type === 'REQUEST') {
      const request = (await RequestModel.getRequestWhere({ request_id: data.request_id }))[0]
      const user = data.receiver_id.includes('printer')
         ? await PrinterModel.getPrinterServiceWhere({ printer_service_id: request.printer_id })
         : await UserModel.getUserWhere({
              user_id: data.receiver_id.includes('chief') ? request.validator_id : request.author_id,
           })
      if (user && user.notification_token){
         const res = await sendNotificationPush([user.notification_token], data.title, data.message, data)
         console.log(res, 'Tokens : ', user.notification_token)
      }
   }
}
