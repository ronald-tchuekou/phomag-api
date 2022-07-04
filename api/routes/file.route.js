/*
 * Copyright (c) 15/03/2022 06:57
 * @author Ronald Tchuekou
 * @email ronaldtchuekou@gmail.com
 */

const express = require('express')
const updload = require('../utils/upload')
const controller = require('../controllers/file.controller')
const authJWT = require('../middelwares/authJWT')

const route = express.Router()

route.use(function (req, res, next) {
   res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept')
   next()
})

route.post(
   '/files/document',
   [authJWT.verifyToken, updload.documentUpload.single('file')],
   controller.createFile,
   (err, req, res) => {
      res.status(400).send({ message: err.message })
   }
)
route.put(
   '/files/document',
   [authJWT.verifyToken, updload.documentUpload.single('file')],
   controller.updateFile,
   (err, req, res) => {
      res.status(400).send({ message: err.message })
   }
)
route.post(
   '/files/avatar',
   [authJWT.verifyToken, updload.avatarUpload.single('file')],
   controller.createFile,
   (err, req, res) => {
      res.status(400).send({ message: err.message })
   }
)
route.put(
   '/files/avatar',
   [authJWT.verifyToken, updload.avatarUpload.single('file')],
   controller.updateFile,
   (err, req, res) => {
      res.status(400).send({ message: err.message })
   }
)
route.delete('/files', [authJWT.verifyToken], controller.deleteFile)
route.get('/files', controller.getFile)

module.exports = route
