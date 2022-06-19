const express = require('express')
const controller = require('../controllers/printer-service.controller')
const authJWT = require('../middelwares/authJWT')

const router = express.Router()

router.post('/printer-service', [authJWT.verifyToken], controller.createPrinterService)
router.get('/printer-service/:id', [authJWT.verifyToken], controller.getPrinterServiceById)
router.get('/printer-service', [authJWT.verifyToken], controller.getPinterService)
router.put('/printer-service/:id', [authJWT.verifyToken], controller.updatePrinterService)
router.put('/printer-service/password/:id', [authJWT.verifyToken], controller.updatePassword)
router.delete('/printer-service/:id', [authJWT.verifyToken], controller.deletePrinterService)

module.exports = router