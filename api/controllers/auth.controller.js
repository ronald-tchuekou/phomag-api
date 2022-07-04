const UserModal = require('../models/user.model')
const PrinterServiceModal = require('../models/printer-service.model')
const bcrypt = require('bcrypt')
const config = require('../config/auth.config')
const jwt = require('jsonwebtoken')
const moment = require('moment')

exports.singIn = async (req, res) => {
   try {
      let response = await UserModal.getUserWhere({ email: req.body.username })
      if (response.length === 0) response = await UserModal.getUserWhere({ matricule: req.body.username })
      if (response.length === 0)
         response = await PrinterServiceModal.getPrinterServiceWhere({ service_email: req.body.username })
      if (response.length === 0)
         return res.status(400).json({
            message: "Your email address or matricule isn't correct!",
            error: response,
         })
      const user = response[0]
      const passwordValid = bcrypt.compareSync(req.body.password, user.password)
      if (!passwordValid)
         return res.status(400).json({
            message: "Your password isn't correct!",
            error: null,
         })
      const pattern = {
         id: user.role === 'Pinter' ? user.printer_service_id : user.user_id,
         role: user.role,
      }
      jwt.sign(pattern, config.secret, {}, async (err, token) => {
         if (err) {
            console.log(err)
            return res.status(400).json({
               message: 'Error are provided when generate the user token!',
               error: err.message,
            })
         }
         if (user.role !== 'Pinter')
            await UserModal.updateUser(
               {
                  created_token: null,
                  updated_at: moment().toDate(),
               },
               user.user_id
            )
            const userResult = user.role === 'Pinter' ? {
               created_at: user.cdreated_at,
               created_token: null,
               department: null,
               email: user.service_email,
               firstname: user.service_name,
               fonction: "Printer Service",
               image_profile: "default_profile.png",
               lastname: user.service_address,
               matricule: null,
               notification_token: user.notification_token,
               password: user.password,
               phone: user.service_phone,
               role: 'Printer',
               sex: null,
               updated_at: user.updated_at,
               user_id: user.printer_service_id,
            } : {...user}

         res.json({
            ...userResult,
            token: token,
         })
      })
   } catch (e) {
      console.log(e)
      res.status(400).json({
         message: 'An error are provided!',
         error: e.message,
      })
   }
}

exports.checkUserEmail = async (req, res) => {
   try {
      let response = await UserModal.getUserWhere({ email: req.params.email })
      if (response.length === 0)
         response = await PrinterServiceModal.getPrinterServiceWhere({ email: req.params.email })
      if (response.length === 0)
         return res.status(400).send({
            message: 'Not user find with this email address!',
            error: response,
         })
      res.json(response[0])
   } catch (error) {
      console.log(error)
      res.status(400).json({
         message: 'Error are provided!',
         error: error.message,
      })
   }
}

exports.resetPassword = async (req, res) => {
   try {
      const response1 = await UserModal.updateUser(
         {
            password: bcrypt.hashSync(req.body.password, 8),
         },
         req.body.user_id
      )
      const response2 = await PrinterServiceModal.updatePrinterService(
         {
            password: bcrypt.hashSync(req.body.password, 8),
         },
         req.body.user_id
      )
      res.json({ response1, response2 })
   } catch (error) {
      console.log(error)
      res.status(400).json({
         message: 'Une erreur lors de la connexion!',
         error: error.message,
      })
   }
}
