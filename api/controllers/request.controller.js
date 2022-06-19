const RequestModel = require("../models/request.model");

exports.createRequest = async (req, res) => {
    try{
        const response = await RequestModel.createRequest(req.body)
        res.json(response)
    }catch(e){
        console.log(e)
        res.status(400).json({
            message: 'Error are provided!',
            error: e.message
        })
    }
}