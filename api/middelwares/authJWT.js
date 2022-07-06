const jwt = require('jsonwebtoken')
const config = require('../config/auth.config')

exports.verifyToken = (req, res, next) => {
   let token = req.headers['x-access-token']
   if (!token) {
      return res.status(400).send({
         message: 'Vous devez vous connecter',
      })
   }
   try {
      jwt.verify(token, config.secret, {}, (err, decoded) => {
         if (err) {
            return res.status(401).send({ message: 'Vous devez vous connecter!' })
         }
         req.user_id = decoded.id
         req.role = decoded.role
         next()
      })
   } catch (error) {
      return res.status(400).json({
         message: 'Une erreur est survenu lors de la vérification du token.',
         error: error,
      })
   }
}

exports.isChief = async (req, res, next) => {
   try {
      if (req.role === 'Chief') {
         next()
         return
      }
      res.status(400).send({
         message: 'Require Chief Role!',
         error: null,
      })
   } catch (e) {
      console.log(e)
      res.status(400).json({
         message: 'Error are provided!',
         error: e.message,
      })
   }
}

exports.isTeacher = async (req, res, next) => {
   try {
      if (req.role === 'Teacher') {
         next()
         return
      }
      res.status(400).send({
         message: 'Require Teacher Role!',
         error: null,
      })
   } catch (e) {
      console.log(e)
      res.status(400).json({
         message: 'Error are provided!',
         error: e.message,
      })
   }
}

exports.isPrinter = async (req, res, next) => {
   try {
      if (req.role === 'Printer') {
         next()
         return
      }
      res.status(400).send({
         message: 'Require Printer Role!',
         error: null,
      })
   } catch (e) {
      console.log(e)
      res.status(400).json({
         message: 'Error are provided!',
         error: e.message,
      })
   }
}
