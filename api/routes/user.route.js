const express = require('express')
const controller = require('../controllers/user.controller')
const authJWT = require('../middelwares/authJWT')

const router = express.Router()

router.post('/user', [authJWT.verifyToken], controller.createUser)
router.get('/user/:id', controller.getUserById)
router.get('/user', controller.getUsers)
router.put('/user/:id', [authJWT.verifyToken], controller.updateUser)
router.put('/user/password/:id', [authJWT.verifyToken], controller.updatePassword)
router.delete('/user/:id', [authJWT.verifyToken], controller.deleteUser)

module.exports = router
