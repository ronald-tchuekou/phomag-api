const DisponibilityModel = require('../models/disponibility.model')

exports.create = async (req, res) => {
   try {
      const response = await DisponibilityModel.create(req.body)
      res.json(response)
   } catch (error) {
      console.log(error)
      res.status(400).json({
         message: 'Error are provided!',
         error: error.message,
      })
   }
}

exports.getByDateAndPrinterId = async (req, res) => {
   try {
      const response = await DisponibilityModel.getWhere({
         date: req.params.date,
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

exports.get = async (req, res) => {
   try {
      const response = await DisponibilityModel.get()
      res.json(response)
   } catch (error) {
      console.log(error)
      res.status(400).json({
         message: 'Error are provided!',
         error: error.message,
      })
   }
}

exports.update = async (req, res) => {
   try {
      const response = await DisponibilityModel.update(req.body, req.params.id)
      res.json(response)
   } catch (error) {
      console.log(error)
      res.status(400).json({
         message: 'Error are provided!',
         error: error.message,
      })
   }
}

exports.delete = async (req, res) => {
   try {
      const response = await DisponibilityModel.delete(req.params.id)
      res.json(response)
   } catch (error) {
      console.log(error)
      res.status(400).json({
         message: 'Error are provided!',
         error: error.message,
      })
   }
}
