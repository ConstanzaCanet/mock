import knex from 'knex';
import __dirname from './utils.js';

const database = knex({
    client:'sqlite3',
    connection:{filename:__dirname+'/db/ecommerce.sqlite'}, 
    useNullAsDefault: true
})

/*
const database = knex({
    client: 'mysql',
    version: '10.4.22',
    connection: {
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '123',
      database: 'ecommerce'
    },
    pool: { min: 0, max: 10 }
  })

*/
export default database;


