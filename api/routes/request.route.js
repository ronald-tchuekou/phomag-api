const express = require('express')
const controller = require('../controllers/request.controller')

const router = express.Router()

router.post('/request', controller.createRequest)

module.exports = router