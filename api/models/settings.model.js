const db_config = require('../config/database.conf')

const DBInstance = db_config.getDBInstance()
const tableName = 'settings'
exports.SettingsTableName = tableName

exports.createTable = () => {
    DBInstance.schema.hasTable(tableName).then(function (exists) {
        if (!exists) {
            return DBInstance.schema.createTable(tableName, (table) => {
                table.increments("setting_id")
                table.integer('print_quota')
                table.timestamps(true, true, false)
            })
        }
        console.log('Settings table is created!')
    });
}
