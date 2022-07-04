const db_config = require('../config/database.conf')
const { PrinterServiceTableName } = require('./printer-service.model')

const DBInstance = db_config.getDBInstance()
const tableName = 'availability'
exports.DisponibilityTableName = tableName

exports.createTable = () => {
   DBInstance.schema.hasTable(tableName).then(function (exists) {
      if (!exists) {
         return DBInstance.schema.createTable(tableName, (table) => {
            table.increments('availability_id')
            table
               .integer('printer_id', 10)
               .unsigned()
               .index()
               .references('printer_service_id')
               .inTable(PrinterServiceTableName)
               .onDelete('SET NULL')
            table.string('begin')
            table.string('end')
            table.date('date')
            table.timestamps(true, true, false)
         })
      }
      console.log('Availability table is created!')
   })
}

/**
 * @param query
 * @returns {Promise<awaited Knex.QueryBuilder<TRecord, TResult>>}
 */
exports.getWhere = async (query) => await DBInstance.from(tableName).where(query).select()

/**
 * @param document
 * @returns {Promise<Knex.QueryBuilder<{}, number[]>>}
 */
exports.create = async (document) => await DBInstance.from(tableName).insert(document)

/**
 * @param document
 * @param availability_id
 * @returns {Promise<Knex.QueryBuilder<{}, number>>}
 */
exports.update = async (document, availability_id) =>
   await DBInstance.where({ availability_id }).from(tableName).update(document)

/**
 * @returns {Promise<awaited Knex.QueryBuilder<TRecord, TResult>>}
 */
exports.get = async () => await DBInstance.from(tableName).select()

/**
 * @param availability_id
 * @returns {Promise<awaited Knex.QueryBuilder<TRecord, number>>}
 */
exports.delete = async (availability_id) => await DBInstance.from(tableName).where({ availability_id }).delete()
