const PrinterServiceModel = require('../models/user.model')
const bcrypt = require('bcrypt')

exports.getUsers = async (req, res) => {
   try {
      const response = await PrinterServiceModel.getAllUser()
      res.json(response)
   } catch (e) {
      console.log(e)
      res.status(400).json({
         message: 'Error are provided!',
         error: e.message
      })
   }
}

exports.getUserById = async (req, res) => {
   try {
      const response = await PrinterServiceModel.getUserWhere({ user_id: req.params.id })
      res.json(response)
   } catch (e) {
      console.log(e)
      res.status(400).json({
         message: 'Error are provided!',
         error: e.message
      })
   }
}

exports.createUser = async (req, res) => {
   try {
      const data = {
         ...req.body,
         password: bcrypt.hashSync('password', 8)
      }
      const response = await PrinterServiceModel.createUser(data)
      res.json(response)
   } catch (e) {
      console.log(e)
      res.status(400).json({
         message: 'An error are provided!',
         error: e.message
      })
   }
}

exports.updateUser = async (req, res) => {
   try {
      const response = await PrinterServiceModel.updateUser(req.body, req.params.id)
      res.json(response)
   } catch (e) {
      console.log(e)
      res.status(400).json({
         message: 'An error are provided!',
         error: e.message
      })
   }
}

exports.updatePassword = async (req, res) => {
   try {
      const data = {
         password: bcrypt.hashSync(req.body.password, 8)
      }
      const response = await PrinterServiceModel.updateUser(data, req.params.id)
      res.json(response)
   } catch (e) {
      console.log(e)
      res.status(400).json({
         message: 'An error are provided!',
         error: e.message
      })
   }
}

exports.deleteUser = async (req, res) => {
   try {
      const response = await PrinterServiceModel.deleteUser(req.params.id)
      res.json(response)
   } catch (e) {
      console.log(e)
      res.status(400).json({
         message: 'An error are provided!',
         error: e.message
      })
   }
}
