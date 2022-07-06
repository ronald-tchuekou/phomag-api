const RequestModel = require('../models/request.model')

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
         validator_id: req.user_id,
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
