const db_config = require('../config/database.conf')

const DBInstance = db_config.getDBInstance()
const tableName = 'users'
exports.UserTableName = tableName

exports.createTable = () => {
    DBInstance.schema.hasTable(tableName).then(function (exists) {
        if (!exists) {
            return DBInstance.schema.createTable(tableName, (table) => {
                table.increments("user_id")
                table.string('matricule', 255).unique().index()
                table.string('lastname', 255)
                table.string('firstname', 255)
                table.string('email', 255).unique().index()
                table.string('phone', 255).unique().index()
                table.string('password', 255)
                table.string('department', 255)
                table.enum('sex', ['F', 'M'])
                table.enum('role', ['Chief', 'Teacher']).defaultTo("Teacher")
                table.text('image_profile').defaultTo("default_image.png")
                table.text('token')
                table.text('created_token')
                table.text('notification_token')
                table.timestamps(true, true, false)
            })
        }
        console.log('Users table is created!')
    });
}

/**
 * @param query
 * @returns {Promise<awaited Knex.QueryBuilder<TRecord, TResult>>}
 */
exports.getUserWhere = async (query) => await DBInstance
    .from(tableName)
    .where(query)
    .select()

/**
 * @param document
 * @returns {Promise<Knex.QueryBuilder<{}, number[]>>}
 */
exports.createUser = async (document) => await DBInstance
    .from(tableName)
    .insert(document)

/**
 * @param document
 * @param user_id
 * @returns {Promise<Knex.QueryBuilder<{}, number>>}
 */
exports.updateUser = async (document, user_id) => await DBInstance
    .where({user_id})
    .from(tableName)
    .update(document)

/**
 * @returns {Promise<awaited Knex.QueryBuilder<TRecord, TResult>>}
 */
exports.getAllUser = async () => await DBInstance
    .from(tableName)
    .select()

/**
 * @param matricule
 * @returns {Promise<awaited Knex.QueryBuilder<TRecord, number>>}
 */
exports.deleteUser = async (matricule) => await DBInstance
    .from(tableName)
    .where({matricule})
    .delete()
