const jwt = require('jsonwebtoken')
const config = require('../config/auth.config')
const UserModel = require('../models/user.model')

exports.verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token']
    if (!token) {
        return res.status(400).send({
            message: 'Vous devez vous connecter'
        })
    }
    try {
        jwt.verify(token, config.secret, {}, (err, decoded) => {
            if (err) {
                return res.status(401).send({message: 'Vous devez vous connecter!'})
            }
            req.user_id = decoded.id
            req.role = decoded.role
            next()
        })
    } catch (error) {
        return res.status(400).json({
            message: 'Une erreur est survenu lors de la vérification du token.',
            error: error
        })
    }
}

exports.isChief = async (req, res, next) => {
    try{
        const response = await UserModel.getUserWhere({user_id: req.user_id})
        if (response.length === 0) {
            return res.status(400).json({
                message: 'User don\'t exist!',
                error: null
            })
        }
        if (response[0].role === 'Chief') {
            next()
            return
        }
        res.status(400).send({
            message: 'Require Chief Role!',
            error: null
        })
    }catch(e){
        console.log(e)
        res.status(400).json({
            message: 'Error are provided!',
            error: e.message
        })
    }
}
