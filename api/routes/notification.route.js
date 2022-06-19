const express = require('express')
const controller = require('../controllers/notification.controller')
const authJWT = require("../middelwares/authJWT");

const router = express.Router()

router.post('/notification',[authJWT.verifyToken], controller.createNotification)
router.get('/notification/:user_id',[authJWT.verifyToken], controller.getNotifications)
router.put('/notification/:id',[authJWT.verifyToken], controller.updateNotification)
router.put('/notification/set-as/read',[authJWT.verifyToken], controller.markAsRead)

module.exports = router