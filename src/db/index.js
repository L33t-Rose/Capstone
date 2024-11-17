import pg from 'pg'
const { Pool } = pg
 
const pool = new Pool({connectionString:process.env.POSTGRES_CONNECTION_URL});
 
export const query = (text, params, callback) => {
  return pool.query(text, params, callback)
}