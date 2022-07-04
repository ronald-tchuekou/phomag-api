require('dotenv').config()
const express = require('express')
const bodyparser = require('body-parser')
const helmet = require('helmet')
const compression = require('compression')
const cors = require('cors')

const authRoutes = require('./api/routes/auth.route')
const notificationRoutes = require('./api/routes/notification.route')
const PrinterServiceRoutes = require('./api/routes/printer-service.route')
const RequestRoutes = require('./api/routes/request.route')
const UserRoutes = require('./api/routes/user.route')
const DisponibilityRoute = require('./api/routes/disponibility.route')

// Get the application.
const app = express()

// Config express server middlewares.
app.use(helmet())
app.use(cors())
app.use(compression())
app.use(bodyparser.json({ limit: '50mb' }))
app.use(
   bodyparser.urlencoded({
      limit: '50mb',
      parameterLimit: 100000,
      extended: true,
   })
)
app.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', '*')
   res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token'
   )
   if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
      return res.status(200).json({})
   }
   next()
})
app.use(express.static(__dirname + '/public'))

// Connection for mysql database.
require('./api/models/user.model').createTable()
require('./api/models/user.model').addFonctionColumn()
require('./api/models/settings.model').createTable()
require('./api/models/printer-service.model').createTable()
require('./api/models/printer-service.model').addServiceAddressColumn()
require('./api/models/printer-service.model').addCreatedByColumn()
require('./api/models/request.model').createTable()
require('./api/models/service_availability.model').createTable()
require('./api/models/notification.model').createTable()
require('./api/models/disponibility.model').createTable()

// Services
require('./service').getPersonnels()

// Routes
app.get('/', (req, res) => {
   res.send('Welcome to api of PhoMag application')
})
app.use('/', authRoutes)
app.use('/', notificationRoutes)
app.use('/', PrinterServiceRoutes)
app.use('/', RequestRoutes)
app.use('/', UserRoutes)
app.use('/', DisponibilityRoute)

// Server listening.
const port = process.env.PORT || 3400
const server = app.listen(port, () => console.log(`Listening on port ${port}..`))

// Socket io, initialize.
require('./socket')(server)
