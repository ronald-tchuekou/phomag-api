const db_config = require('../config/database.conf')
const {UserTableName} = require("./user.model");
const {PrinterServiceTableName} = require("./printer-service.model");

const DBInstance = db_config.getDBInstance()
const tableName = 'requests'
exports.RequestsTableName = tableName

exports.createTable = () => {
    DBInstance.schema.hasTable(tableName).then(function (exists) {
        if (!exists) {
            return DBInstance.schema.createTable(tableName, (table) => {
                table.increments("request_id")
                table.string('request_name')
                table.text('request_description')
                table.string('classe')
                table.text('document_list')
                table.integer('request_qte')
                table.enum('request_status',['PENDING','VALIDATE','PRINTED','CANCELED'])
                table.integer('author_id', 10).unsigned().index()
                    .references('user_id')
                    .inTable(UserTableName)
                    .onDelete('SET NULL')
                table.integer('validator_id', 10).unsigned().index()
                    .references('user_id')
                    .inTable(UserTableName)
                    .onDelete('SET NULL')
                table.integer('printer_id', 10).unsigned().index()
                    .references('printer_service_id')
                    .inTable(PrinterServiceTableName)
                    .onDelete('SET NULL')
                table.timestamps(true, true, false)
            })
        }
        console.log('Requests table is created!')
    });
}
