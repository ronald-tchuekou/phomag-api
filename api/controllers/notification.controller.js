const NotificationModel = require('../models/notification.model')
const PrinterServiceModel = require("../models/printer-service.model");
const UserModel = require('../models/user.model')
const {sendNotificationPush} = require("../config/notification");
const socket = require("../config/socket-client.config");

exports.getNotifications = async (req, res) => {
    try{
        const response = await NotificationModel.getNotificationWhere({receiver_id: req.params.user_id})
        res.json(response)
    }catch(e){
        console.log(e)
        res.status(400).json({
            message: 'Error are provided!',
            error: e.message
        })
    }
}

exports.createNotification = async (req, res) => {
    try{
        const data = {
            title: req.body.title,
            message: req.body.message,
            is_read: false,
            type: req.body.type,
            sender_id: req.body.sender_id,
            receiver_id: req.body.receiver_id,
            request_id: req.body.request_id,
        }

        // To send notification to device.
        let user
        if(req.role === 'Printer')
            user = await PrinterServiceModel.getPrinterServiceWhere({printer_service_id: data.receiver_id})
        else
            user = await UserModel.getUserWhere({user_id: data.receiver_id})
        const notification_token = user.notification_token

        if(notification_token)
        await sendNotificationPush([notification_token], data.title, data.message, data)

        socket.emit('notify', data)

        res.json(response)
    }catch (e) {
        console.log(e)
        res.status(400).json({
            message: "An error are provided!",
            error: e.message
        })
    }
}

exports.updateNotification = async (req, res) => {
    try{
        const response = await NotificationModel.updateNotification(req.body, req.params.id)
        res.json(response)
    }catch (e) {
        console.log(e)
        res.status(400).json({
            message: "An error are provided!",
            error: e.message
        })
    }
}

exports.markAsRead = async (req, res) => {
    let response = []
    const update = async  item => {
        response.push(await NotificationModel.updateNotification(
            {is_read: true},
            item
        ))
    }
    try{
        if(req.body.notification_ids)
            req.body.notification_ids.forEach(update)
        res.json(response)
    }catch (e) {
        console.log(e)
        res.status(400).json({
            message: "An error are provided!",
            error: e.message
        })
    }
}

exports.deleteNotification = async (req, res) => {
    try{
        const response = await NotificationModel.deleteNotification(req.params.id)
        res.json(response)
    }catch (e) {
        console.log(e)
        res.status(400).json({
            message: "An error are provided!",
            error: e.message
        })
    }
}