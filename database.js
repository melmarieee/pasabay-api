const { Pool } = require('pg')
var md5 = require('md5')


const pool = new Pool({
  connectionString: "postgres://qxybxezzfhmdvk:701483b1359b1f4a04c3d12cfa4d0fdb0fc3337c9b2bfd187615bf62d6907366@ec2-44-213-228-107.compute-1.amazonaws.com:5432/da4e0tc0hd77ch",
  ssl: {
    rejectUnauthorized: false
  }
})



const db = async (query) => {
    try {
        const client = await pool.connect();
        const result = await client.query(query);
        return result ? result.rows : null;
    } catch (err) {
        console.error(err);
    }
}

// md5("user123456")
module.exports = db
