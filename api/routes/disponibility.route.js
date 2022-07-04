const express = require('express')
const controller = require('../controllers/disponibility.controller')
const authJWT = require('../middelwares/authJWT')

const router = express.Router()

router.post('/availability', [authJWT.verifyToken], controller.create)
router.get('/availability/:date/:printer_id', controller.getByDateAndPrinterId)
router.get('/availability', controller.get)
router.put('/availability/:id', [authJWT.verifyToken], controller.update)
router.delete('/availability/:id', [authJWT.verifyToken], controller.delete)

module.exports = router