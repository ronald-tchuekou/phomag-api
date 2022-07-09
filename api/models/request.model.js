const db_config = require('../config/database.conf')
const { UserTableName } = require('./user.model')
const { PrinterServiceTableName } = require('./printer-service.model')

const DBInstance = db_config.getDBInstance()
const tableName = 'requests'
exports.RequestsTableName = tableName

exports.createTable = () => {
   DBInstance.schema.hasTable(tableName).then(function (exists) {
      if (!exists) {
         return DBInstance.schema.createTable(tableName, (table) => {
            table.increments('request_id')
            table.string('request_name')
            table.text('request_description')
            table.string('classe')
            table.text('document_list')
            table.integer('request_qte')
            table.enum('request_status', ['PENDING', 'VALIDATE', 'PRINTED', 'CANCELED'])
            table
               .integer('author_id', 10)
               .unsigned()
               .index()
               .references('user_id')
               .inTable(UserTableName)
               .onDelete('SET NULL')
            table
               .integer('validator_id', 10)
               .unsigned()
               .index()
               .references('user_id')
               .inTable(UserTableName)
               .onDelete('SET NULL')
            table
               .integer('printer_id', 10)
               .unsigned()
               .index()
               .references('printer_service_id')
               .inTable(PrinterServiceTableName)
               .onDelete('SET NULL')
            table.timestamps(true, true, false)
         })
      }
      console.log('Requests table is created!')
   })
}

/**
 * @param query
 * @returns {Promise<awaited Knex.QueryBuilder<TRecord, TResult>>}
 */
exports.getRequestWhere = async (query) =>
   await DBInstance.join(UserTableName, tableName + '.author_id', UserTableName + '.user_id')
      .from(tableName)
      .where(query)
      .select()
      .orderBy(tableName + '.created_at', 'desc')

/**
 * @param document
 * @returns {Promise<Knex.QueryBuilder<{}, number[]>>}
 */
exports.createRequest = async (document) => await DBInstance.from(tableName).insert(document)

/**
 * @param document
 * @param request_id
 * @returns {Promise<Knex.QueryBuilder<{}, number>>}
 */
exports.updateRequest = async (document, request_id) =>
   await DBInstance.where({ request_id }).from(tableName).update(document)

/**
 * @returns {Promise<awaited Knex.QueryBuilder<TRecord, TResult>>}
 */
exports.getAllRequest = async () =>
   await DBInstance.join(UserTableName, tableName + '.author_id', UserTableName + '.user_id')
      .from(tableName)
      .select()
      .orderBy(tableName + '.created_at', 'desc')

/**
 * @param request_id
 * @returns {Promise<awaited Knex.QueryBuilder<TRecord, number>>}
 */
exports.deleteRequest = async (request_id) => await DBInstance.from(tableName).where({ request_id }).delete()
