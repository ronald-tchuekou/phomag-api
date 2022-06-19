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

/**
 * @param query
 * @returns {Promise<awaited Knex.QueryBuilder<TRecord, TResult>>}
 */
exports.getServiceAvailabilityWhere = async (query) => await DBInstance
    .from(tableName)
    .where(query)
    .select()

/**
 * @param document
 * @returns {Promise<Knex.QueryBuilder<{}, number[]>>}
 */
exports.createServiceAvailability = async (document) => await DBInstance
    .from(tableName)
    .insert(document)

/**
 * @param document
 * @param service_availability_id
 * @returns {Promise<Knex.QueryBuilder<{}, number>>}
 */
exports.updateServiceAvailability = async (document, service_availability_id) => await DBInstance
    .where({service_availability_id})
    .from(tableName)
    .update(document)

/**
 * @returns {Promise<awaited Knex.QueryBuilder<TRecord, TResult>>}
 */
exports.getAllServiceAvailability = async () => await DBInstance
    .from(tableName)
    .select()

/**
 * @param service_availability_id
 * @returns {Promise<awaited Knex.QueryBuilder<TRecord, number>>}
 */
exports.deleteServiceAvailability = async (service_availability_id) => await DBInstance
    .from(tableName)
    .where({service_availability_id})
    .delete()
