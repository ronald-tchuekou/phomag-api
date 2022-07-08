const RequestModel = require('../models/request.model')
const PrinterModel = require('../models/printer-service.model')
const DisponibilityModel = require('../models/disponibility.model')
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

exports.createRequest = async (req, res) => {
   try {
      const response = await RequestModel.createRequest(req.body)
      res.json(response)
   } catch (e) {
      console.log(e)
      res.status(400).json({
         message: 'Error are provided!',
         error: e.message,
      })
   }
}

exports.updateRequest = async (req, res) => {
   try {
      const response = await RequestModel.updateRequest(req.body, req.params.id)
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

      res.json(response)
   } catch (e) {
      console.log(e)
      res.status(400).json({
         message: 'Error are provided!',
         error: e.message,
      })
   }
}
