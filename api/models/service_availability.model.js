const db_config = require('../config/database.conf')
const {PrinterServiceTableName} = require("./printer-service.model");

const DBInstance = db_config.getDBInstance()
const tableName = 'service_availability'
exports.ServiceAvailabilityTableName = tableName

exports.createTable = () => {
    DBInstance.schema.hasTable(tableName).then(function (exists) {
        if (!exists) {
            return DBInstance.schema.createTable(tableName, (table) => {
                table.increments("service_availability_id")
                table.time('begin')
                table.time('end')
                table.date('date')
                table.integer('owner_id', 10).unsigned().index()
                    .references('printer_service_id')
                    .inTable(PrinterServiceTableName)
                    .onDelete('SET NULL')
                table.timestamps(true, true, false)
            })
        }
        console.log('Service availability table is created!')
    });
}
