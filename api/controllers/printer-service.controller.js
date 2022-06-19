const PrinterServiceModel = require("../models/printer-service.model");
const bcrypt = require('bcrypt')

exports.getPinterService = async (req, res) => {
    try{
        const response = await PrinterServiceModel.getAllPrinterService()
        res.json(response)
    }catch(e){
        console.log(e)
        res.status(400).json({
            message: 'Error are provided!',
            error: e.message
        })
    }
}

exports.getPrinterServiceById = async (req, res) => {
    try{
        const response = await PrinterServiceModel.getPrinterServiceWhere({printer_service_id: req.params.id})
        res.json(response)
    }catch(e){
        console.log(e)
        res.status(400).json({
            message: 'Error are provided!',
            error: e.message
        })
    }
}

exports.createPrinterService = async (req, res) => {
    try{
        const data = {
            ...req.body,
            password: bcrypt.hashSync('password', 8)
        }
        const response = await PrinterServiceModel.createPrinterService(data)
        res.json(response)
    }catch (e) {
        console.log(e)
        res.status(400).json({
            message: "An error are provided!",
            error: e.message
        })
    }
}

exports.updatePrinterService = async (req, res) => {
    try{
        const response = await PrinterServiceModel.updatePrinterService(req.body, req.params.id)
        res.json(response)
    }catch (e) {
        console.log(e)
        res.status(400).json({
            message: "An error are provided!",
            error: e.message
        })
    }
}

exports.updatePassword = async (req, res) => {
    try{
        const data = {
            password: bcrypt.hashSync(req.body.password, 8)
        }
        const response = await PrinterServiceModel.updatePrinterService(data, req.params.id)
        res.json(response)
    }catch (e) {
        console.log(e)
        res.status(400).json({
            message: "An error are provided!",
            error: e.message
        })
    }
}

exports.deletePrinterService = async (req, res) => {
    try{
        const response = await PrinterServiceModel.deletePrinterService(req.params.id)
        res.json(response)
    }catch (e) {
        console.log(e)
        res.status(400).json({
            message: "An error are provided!",
            error: e.message
        })
    }
}