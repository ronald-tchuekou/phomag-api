const db_config = require('../config/database.conf')

const DBInstance = db_config.getDBInstance()
const tableName = 'printer_services'
exports.PrinterServiceTableName = tableName

exports.createTable = () => {
    DBInstance.schema.hasTable(tableName).then(function (exists) {
        if (!exists) {
            return DBInstance.schema.createTable(tableName, (table) => {
                table.increments("printer_service_id")
                table.string('service_name', 255)
                table.string('service_email', 255).unique().index()
                table.string('service_phone', 255).unique().index()
                table.string('password', 255)
                table.string('department', 255)
                table.text('image_profile').defaultTo("default_image.png")
                table.text('token')
                table.text('created_token')
                table.text('notification_token')
                table.timestamps(true, true, false)
            })
        }
        console.log('Printer service table is created!')
    });
}
