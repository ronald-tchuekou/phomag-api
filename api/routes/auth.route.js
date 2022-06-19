const express = require('express')
const controller = require('../controllers/auth.controller')

const router = express.Router()

router.post('/auth/sing-in', controller.singIn)

module.exports = router