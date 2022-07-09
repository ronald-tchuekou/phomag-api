const db_config = require('../config/database.conf')
const { RequestsTableName } = require('./request.model')

const DBInstance = db_config.getDBInstance()
const tableName = 'notifications'
exports.NotificationsTableName = tableName

exports.createTable = () => {
   DBInstance.schema.hasTable(tableName).then(function (exists) {
      if (!exists) {
         return DBInstance.schema.createTable(tableName, (table) => {
            table.increments('notification_id')
            table.string('title')
            table.text('message')
            table.boolean('is_read').defaultTo(false)
            table.enum('type', ['REQUEST', 'INFO'])
            table.integer('sender_id', 10).unsigned().index()
            table.integer('receiver_id', 10).unsigned().index()
            table
               .integer('request_id', 10)
               .unsigned()
               .index()
               .references('request_id')
               .inTable(RequestsTableName)
               .onDelete('SET NULL')
            table.timestamps(true, true, false)
         })
      }
      console.log('Notifications table is created!')
   })
}

/**
 * @param query
 * @returns {Promise<awaited Knex.QueryBuilder<TRecord, TResult>>}
 */
exports.getNotificationsWhere = async (query) => await DBInstance.from(tableName).where(query).select()

/**
 * @param document
 * @returns {Promise<Knex.QueryBuilder<{}, number[]>>}
 */
exports.createNotification = async (document) => await DBInstance.from(tableName).insert(document)

/**
 * @param document
 * @param notification_id
 * @returns {Promise<Knex.QueryBuilder<{}, number>>}
 */
exports.updateNotification = async (document, notification_id) =>
   await DBInstance.where({ notification_id }).from(tableName).update(document)

/**
 * @returns {Promise<awaited Knex.QueryBuilder<TRecord, TResult>>}
 */
exports.getAllNotification = async () => await DBInstance.from(tableName).select()

/**
 * @param notification_id
 * @returns {Promise<awaited Knex.QueryBuilder<TRecord, number>>}
 */
exports.deleteNotification = async (notification_id) =>
   await DBInstance.from(tableName).where({ notification_id }).delete()
