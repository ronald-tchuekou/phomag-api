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
