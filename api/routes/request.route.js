const express = require('express')
const controller = require('../controllers/request.controller')
const authJWT = require('../middelwares/authJWT')

const router = express.Router()

router.get('/request', controller.getAllRequests)
router.get('/request/author', [authJWT.verifyToken, authJWT.isTeacher], controller.getAuthorRequests)
router.get('/request/vadator', [authJWT.verifyToken, authJWT.isChief], controller.getValidatorRequests)
router.get('/request/printer', [authJWT.verifyToken, authJWT.isPrinter], controller.getPrinterRequests)
router.post('/request', controller.createRequest)
router.put('/request/:id', controller.updateRequest)
router.delete('/request/:id', controller.deleteRequest)

module.exports = router
