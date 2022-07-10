const RequestModel = require('../models/request.model')
const PrinterModel = require('../models/printer-service.model')
const UserModel = require('../models/user.model')
const DisponibilityModel = require('../models/disponibility.model')
const socket = require('../config/socket-client.config')
const moment = require('moment')

exports.getAllRequests = async (req, res) => {
   try {
      const response = await RequestModel.getAllRequest()
      res.json(response)
   } catch (error) {
      console.log(error)
      res.status(400).json({
         message: 'Error are provided!',
         error: error.message,
      })
   }
}

exports.getAuthorRequests = async (req, res) => {
   try {
      const query = req.query.status ? { request_status: req.query.status } : {}
      const response = await RequestModel.getRequestWhere({
         author_id: req.user_id,
         ...query,
      })
      res.json(response)
   } catch (error) {
      console.log(error)
      res.status(400).json({
         message: 'Error are provided!',
         error: error.message,
      })
   }
}

exports.getValidatorRequests = async (req, res) => {
   try {
      const query = req.query.status ? { request_status: req.query.status } : {}
      const response = await RequestModel.getRequestWhere({
         ...query,
      })
      res.json(response)
   } catch (error) {
      console.log(error)
      res.status(400).json({
         message: 'Error are provided!',
         error: error.message,
      })
   }
}

exports.getPrinterRequests = async (req, res) => {
   try {
      const query = req.query.status ? { request_status: req.query.status } : {}
      const response = await RequestModel.getRequestWhere({
         printer_id: req.user_id,
         ...query,
      })
      res.json(response)
   } catch (error) {
      console.log(error)
      res.status(400).json({
         message: 'Error are provided!',
         error: error.message,
      })
   }
}

exports.getPrinterRequestsById = async (req, res) => {
   try {
      const response = await RequestModel.getRequestWhere({
         printer_id: req.params.printer_id,
      })
      res.json(response)
   } catch (error) {
      console.log(error)
      res.status(400).json({
         message: 'Error are provided!',
         error: error.message,
      })
   }
}

exports.createRequest = async (req, res) => {
   try {
      const response = await RequestModel.createRequest(req.body)
      const fetch = await UserModel.getUserWhere({ user_id: req.body.author_id })
      const count = JSON.parse(req.body.document_list || '[]').length
      socket.emit('notify', {
         title: 'Request initialized',
         message: `${fetch[0].sex === 'F' ? 'Md.' : 'Mr.'} ${fetch[0].lastname} ${
            fetch[0].firstname
         } are init a new request that contain ${count} document(s) to print.`,
         is_read: false,
         type: 'REQUEST',
         sender_id: `user_${fetch[0].user_id}`,
         receiver_id: `chief`,
         request_id: response[0],
      })
      res.json(response)
   } catch (e) {
      console.log(e)
      res.status(400).json({
         message: 'Error are provided!',
         error: e.message,
      })
   }
}

const notifyThis = async (validator_id, status, request, printer_id) => {
   let message = '',
      title = ''
   switch (status) {
      case 'PRINTED':
         const printer = await PrinterModel.getPrinterServiceWhere({ printer_service_id: printer_id })
         title = 'Request printed'
         message = `Printer service ${printer.service_name} are printed your request, the address of this service are : ${printer.service_address}.`
         break

      default:
         const validator = (await UserModel.getUserWhere({ user_id: validator_id }))[0]
         if (status === 'VALIDATE') {
            title = 'Request validated'
            message = `${validator.sex === 'F' ? 'Md.' : 'Mr.'} ${validator.lastname} ${
               validator.firstname
            } are validate your request that contain documents to print.`
         } else {
            title = 'Request canceled'
            message = `${validator.sex === 'F' ? 'Md.' : 'Mr.'} ${validator.lastname} ${
               validator.firstname
            } are canceled your request that contain documents to print.`
         }

         break
   }

   socket.emit('notify', {
      title: title,
      message: message,
      is_read: false,
      type: 'REQUEST',
      sender_id: validator_id ? 'user_' + validator_id : 'printer_' + printer_id,
      receiver_id: 'user_' + request.author_id,
      request_id: request.request_id,
   })
}

exports.updateRequest = async (req, res) => {
   try {
      await RequestModel.updateRequest(req.body, req.params.id)
      const response = await RequestModel.getRequestWhere({ request_id: req.params.id })
      if (req.body.validator_id || req.body.request_status === 'PRINTED')
         notifyThis(req.body.validator_id, req.body.request_status, response, req.body.printer_id)
      res.json(response)
   } catch (e) {
      console.log(e)
      res.status(400).json({
         message: 'Error are provided!',
         error: e.message,
      })
   }
}

exports.deleteRequest = async (req, res) => {
   try {
      const response = await RequestModel.deleteRequest(req.params.id)
      res.json(response)
   } catch (error) {
      console.log(error)
      res.status(400).json({
         message: 'Error are provided!',
         error: error.message,
      })
   }
}

exports.assignRequest = async (req, res) => {
   try {
      const request_id = req.query.request_id
      const validator_id = req.query.validator_id
      const date = req.query.date

      if (!request_id)
         return res.status(400).json({
            message: 'Please set the request_id field !',
            error: null,
         })

      if (!validator_id)
         return res.status(400).json({
            message: 'Please set the validator_id field !',
            error: null,
         })

      if (!date)
         return res.status(400).json({
            message: 'Please set the date field !',
            error: null,
         })

      const printers = await PrinterModel.getPrinterServiceWhere({ created_by: validator_id })
      const printer_ids = printers.map((item) => item.printer_service_id)

      const availabilities = await DisponibilityModel.getWherePrinterIdIn(printer_ids)

      const valid_availabilities = availabilities.filter((item) => {
         const item_date = moment(item.date).format('YYYY-MM-DD') + ` ${item.end.replace('h', ':')}`
         return moment(date).isBefore(moment(item_date))
      })

      if (valid_availabilities.length === 0)
         return res.status(400).json({
            message: 'Any printer service is available!',
            error: null,
         })

      const response = await RequestModel.updateRequest(
         {
            request_status: 'VALIDATE',
            printer_id: valid_availabilities[0].printer_id,
            updated_at: moment().toDate(),
         },
         request_id
      )

      socket.emit('notify', {
         title: 'New request assigned',
         message:
            'The new request is validate and assigned to you. Please try to printed it and set to this app that you are finish to print it.',
         is_read: false,
         type: 'REQUEST',
         sender_id: 'user_' + req.query.validator_id,
         receiver_id: 'printer_' + valid_availabilities[0].printer_id,
         request_id: request_id,
      })

      res.json(response)
   } catch (e) {
      console.log(e)
      res.status(400).json({
         message: 'Error are provided!',
         error: e.message,
      })
   }
}
