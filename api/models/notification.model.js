const db_config = require('../config/database.conf')
const {RequestsTableName} = require("./request.model");

const DBInstance = db_config.getDBInstance()
const tableName = 'notifications'
exports.NotificationsTableName = tableName

exports.createTable = () => {
    DBInstance.schema.hasTable(tableName).then(function (exists) {
        if (!exists) {
            return DBInstance.schema.createTable(tableName, (table) => {
                table.increments("notification_id")
                table.string('title')
                table.text('message')
                table.boolean('is_read').defaultTo(false)
                table.enum('type', ['REQUEST', 'INFO'])
                table.integer('sender_id', 10).unsigned().index()
                table.integer('receiver_id', 10).unsigned().index()
                table.integer('request_id', 10).unsigned().index()
                    .references('request_id')
                    .inTable(RequestsTableName)
                    .onDelete('SET NULL')
                table.timestamps(true, true, false)
            })
        }
        console.log('Notifications table is created!')
    });
}
