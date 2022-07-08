/*
 * Copyright (c) 15/03/2022 09:46
 * @author Ronald Tchuekou
 * @email ronaldtchuekou@gmail.com
 */

const fs = require('fs')

exports.createFile = (req, res) => {
   if (req.file) res.send({ path: req.file.filename })
   else res.status(400).send({ message: 'Pas de fichier uploadé !' })
}

exports.getFile = async (req, res) => {
   try {
      const bucket = req.query.bucket
      let filename = req.query.filename
      const file = `${__dirname}/../../public/${bucket}/${filename}`
      let readStream = fs.createReadStream(file)
      filename = encodeURIComponent(filename)
      readStream.on('open', function () {
         // res.setHeader('Content-disposition', `inline; filename=${filename}`)
         res.setHeader('X-Download-Options', 'open')
         res.setHeader('Content-type', bucket === 'documents' ? 'application/pdf' : 'image/*')
         readStream.pipe(res)
      })
      readStream.on('error', function (err) {
         res.status(400).send({ message: "Une erreur est survenu lors de l'affichage du fichier.", error: err.message })
      })
   } catch (e) {
      res.status(400).send({ message: "Une erreur est survenu lors de l'affichage du fichier.", error: e.message })
   }
}

exports.updateFile = async (req, res) => {
   try {
      const bucket = req.query.bucket
      const filename = req.query.filename
      const file = `${__dirname}/../../public/${bucket}/${filename}`
      await fs.rmSync(file)
      res.send({ path: req.file.filename })
   } catch (e) {
      res.status(400).send({ message: 'Une erreur est survenu lors de la suppression du fichier.' })
   }
}

exports.deleteFile = async (req, res) => {
   try {
      const bucket = req.query.bucket
      const filename = req.query.filename
      const file = `${__dirname}/../../public/${bucket}/${filename}`
      await fs.rmSync(file)
      res.send({ message: 'Fichier supprimé avec succès !' })
   } catch (e) {
      console.log(e)
      res.status(400).send({ message: 'Une erreur est survenu lors de la suppression du fichier.', error: e.message })
   }
}
