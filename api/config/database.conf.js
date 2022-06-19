const knex = require('knex')

/**
 * @return {Knex<any, unknown[]>}
 */
exports.getDBInstance = () => knex({
   client: 'mysql',
   connection: {
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASS,
      database: process.env.MYSQL_DATABASE,
   }
})
