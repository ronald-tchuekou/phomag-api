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

/**
 * @param query
 * @returns {Promise<awaited Knex.QueryBuilder<TRecord, TResult>>}
 */
exports.getSettingWhere = async (query) => await DBInstance
    .from(tableName)
    .where(query)
    .select()

/**
 * @param document
 * @returns {Promise<Knex.QueryBuilder<{}, number[]>>}
 */
exports.createSetting = async (document) => await DBInstance
    .from(tableName)
    .insert(document)

/**
 * @param document
 * @param setting_id
 * @returns {Promise<Knex.QueryBuilder<{}, number>>}
 */
exports.updateSetting = async (document, setting_id) => await DBInstance
    .where({setting_id})
    .from(tableName)
    .update(document)

/**
 * @returns {Promise<awaited Knex.QueryBuilder<TRecord, TResult>>}
 */
exports.getAllSetting = async () => await DBInstance
    .from(tableName)
    .select()

/**
 * @param setting_id
 * @returns {Promise<awaited Knex.QueryBuilder<TRecord, number>>}
 */
exports.deleteSetting = async (setting_id) => await DBInstance
    .from(tableName)
    .where({setting_id})
    .delete()
