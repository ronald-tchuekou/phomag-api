/*
 * Copyright (c) 15/03/2022 06:57
 * @author Ronald Tchuekou
 * @email ronaldtchuekou@gmail.com
 */

const express = require('express')
const updload = require('../utils/upload')
const controller = require('../controllers/file.controller')
const { authJwt } = require('../middlewares')

const route = express.Router()

route.use(function (req, res, next) {
   res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept')
   next()
})

route.post(
   '/files/document',
   [authJwt.verifyToken, updload.documentUpload.single('file')],
   controller.createFile,
   (err, req, res) => {
      res.status(400).send({ message: err.message })
   }
)
route.put(
   '/files/document',
   [authJwt.verifyToken, updload.documentUpload.single('file')],
   controller.updateFile,
   (err, req, res) => {
      res.status(400).send({ message: err.message })
   }
)
route.post(
   '/files/avatar',
   [authJwt.verifyToken, updload.avatarUpload.single('file')],
   controller.createFile,
   (err, req, res) => {
      res.status(400).send({ message: err.message })
   }
)
route.put(
   '/files/avatar',
   [authJwt.verifyToken, updload.avatarUpload.single('file')],
   controller.updateFile,
   (err, req, res) => {
      res.status(400).send({ message: err.message })
   }
)
route.delete('/files', [authJwt.verifyToken], controller.deleteFile)
route.get('/files', controller.getFile)

module.exports = route
