const multer = require('multer')

// Multer config
const storageDocument = multer.diskStorage({
   destination: function (req, file, cb) {
      const destination = `public/documents`
      console.log(file.destination)
      cb(null, destination)
   },
   filename: function (req, file, cb) {
      const filename = new Date().getTime() + file.originalname
      cb(null, filename)
   },
})
const storageAvatar = multer.diskStorage({
   destination: function (req, file, cb) {
      const destination = `public/avatars`
      console.log(file.destination)
      cb(null, destination)
   },
   filename: function (req, file, cb) {
      const filename = new Date().getTime() + file.originalname
      cb(null, filename)
   },
})

const fileFilter = (req, file, cb) => {
   console.log('file mime type : ', file.mimetype)
   if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'application/pdf'
   ) {
      cb(null, true)
   } else {
      cb(new Error('Please file we be an image web extension jpg png jpeg or pdf.'))
   }
}

exports.documentUpload = multer({
   storage: storageDocument,
   limits: {
      fileSize: 1024 * 1024 * 50, // 50m
   },
   fileFilter: fileFilter,
})

exports.avatarUpload = multer({
   storage: storageAvatar,
   limits: {
      fileSize: 1024 * 1024, // 1m
   },
   fileFilter: fileFilter,
})
