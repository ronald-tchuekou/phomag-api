/*
 * Copyright (c) 18/04/2022 08:51
 * @author Ronald Tchuekou
 * @email ronaldtchuekou@gmail.com
 */

const nodeMailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')
const path = require('path')

const mailT = nodeMailer.createTransport({
   host: process.env.SMTP_HOST,
   port: process.env.SMTP_PORT,
   secure: true,
   auth: {
      user: process.env.SMTP_AUTH_USER,
      pass: process.env.SMTP_AUTH_PASS
   }
})

mailT.use('compile', hbs({
   viewEngine: {
      extname: '.hbs',
      layoutsDir: path.resolve('views/'),
      defaultLayout: false
   },
   viewPath: path.resolve('views/'),
   extName: '.hbs'
}))

exports.mailTransporter = mailT
