const db_config = require('../config/database.conf')
const { UserTableName } = require('./user.model')

const DBInstance = db_config.getDBInstance()
const tableName = 'printer_services'
exports.PrinterServiceTableName = tableName

exports.createTable = () => {
   DBInstance.schema.hasTable(tableName).then(function (exists) {
      if (!exists) {
         return DBInstance.schema.createTable(tableName, (table) => {
            table.increments('printer_service_id')
            table.string('service_name', 255)
            table.string('service_email', 255).unique().index()
            table.string('service_phone', 255).unique().index()
            table.string('password', 255)
            table.string('department', 255)
            table.string('role', 255).defaultTo('Pinter')
            table.text('image_profile').defaultTo('default_image.png')
            table.text('token')
            table.text('created_token')
            table.text('notification_token')
            table.timestamps(true, true, false)
         })
      }
      console.log('Printer service table is created!')
   })
}

exports.addServiceAddressColumn = () => {
   DBInstance.schema.hasColumn(tableName, 'service_address').then(function (exists) {
      if (!exists) {
         return DBInstance.schema.table(tableName, (table) => {
            table.string('service_address', 255)
         })
      }
      console.log('Added service_address column to Printer service table!')
   })
}

exports.addCreatedByColumn = () => {
   DBInstance.schema.hasColumn(tableName, 'created_by').then(function (exists) {
      if (!exists) {
         return DBInstance.schema.table(tableName, (table) => {
            table
               .integer('created_by', 255)
               .unsigned()
               .index()
               .references('user_id')
               .inTable(UserTableName)
               .onDelete('SET NULL')
         })
      }
      console.log('Added service_address column to Printer service table!')
   })
}

/**
 * @param query
 * @returns {Promise<awaited Knex.QueryBuilder<TRecord, TResult>>}
 */
exports.getPrinterServiceWhere = async (query) => await DBInstance.from(tableName).where(query).select()

/**
 * @param document
 * @returns {Promise<Knex.QueryBuilder<{}, number[]>>}
 */
exports.createPrinterService = async (document) => await DBInstance.from(tableName).insert(document)

/**
 * @param document
 * @param printer_service_id
 * @returns {Promise<Knex.QueryBuilder<{}, number>>}
 */
exports.updatePrinterService = async (document, printer_service_id) =>
   await DBInstance.where({ printer_service_id }).from(tableName).update(document)

/**
 * @returns {Promise<awaited Knex.QueryBuilder<TRecord, TResult>>}
 */
exports.getAllPrinterService = async () => await DBInstance.from(tableName).select()

/**
 * @param printer_service_id
 * @returns {Promise<awaited Knex.QueryBuilder<TRecord, number>>}
 */
exports.deletePrinterService = async (printer_service_id) =>
   await DBInstance.from(tableName).where({ printer_service_id }).delete()
