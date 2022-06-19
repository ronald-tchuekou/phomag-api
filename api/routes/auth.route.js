const express = require('express')
const controller = require('../controllers/auth.controller')

const router = express.Router()

router.post('/auth/sing-in', controller.singIn)
router.get('/auth/pass-forgot/:email', controller.checkUserEmail)
router.put('/auth/reset-password', controller.resetPassword)

module.exports = router