const express = require('express')
const controller = require('../controllers/notification.controller')
const authJWT = require('../middelwares/authJWT')

const router = express.Router()

router.post('/notification', [authJWT.verifyToken], controller.createNotification)
router.get('/notification', [authJWT.verifyToken], controller.getNotifications)
router.put('/notification/:id', [authJWT.verifyToken], controller.updateNotification)
router.delete('/notification/:id', [authJWT.verifyToken], controller.deleteNotification)
router.put('/notification/set-as/read', [authJWT.verifyToken], controller.markAsRead)

module.exports = router
