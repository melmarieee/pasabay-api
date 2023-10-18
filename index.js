var express = require("express")
var app = express()

const { Pool } = require('pg')
const pool = new Pool({
  connectionString: "postgres://qxybxezzfhmdvk:701483b1359b1f4a04c3d12cfa4d0fdb0fc3337c9b2bfd187615bf62d6907366@ec2-44-213-228-107.compute-1.amazonaws.com:5432/da4e0tc0hd77ch",
  ssl: {
    rejectUnauthorized: false
  }
})


var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var HTTP_PORT = 5000

app.listen(process.env.PORT || 5000, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});


app.post('/api/login', async (req, res) => {
  try {
    const data = {
      email: req.body.email,
      password : req.body.password
    }

    const client = await pool.connect();
    const result = await client.query("SELECT * FROM users WHERE email = '" + data.email + "' AND password = MD5('" + data.password + "')");
    const results = result.rows;
    client.release();

    if (results.length != 0) {
      res.json({
        "message":"Success",
        "data": 1
      })
    } else {
      res.json({
        "message":"Invalid Username and Password",
        "data": 0
      })
    }

    } catch (err) {
      console.error(err);
      res.json({
        "message":"Error",
        "data": err
      })
    }
})


app.post('/api/signup', async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      email: req.body.email,
      password : req.body.password
    }

    const client = await pool.connect();
    const result = await client.query("INSERT INTO users (name, email, password) VALUES ('" + data.name +"', '"+ data.email +"', MD5('" + data.password +"'))");
    const results = { 'results': (result) ? result.rows : null};
    client.release();

    res.json({
      "message":"success",
      "data": results
    })

    } catch (err) {
      console.error(err);
      res.json({
        "message":"Error",
        "data": err
      })
    }
})



app.post('/api/create_ride', async (req, res) => {
  try {
    const data = {
      start_location: req.body.start_location,
      end_location: req.body.end_location,
      date: req.body.date,
      time: req.body.time,
      driver_id: req.body.driver_id,
      vehicle_id: req.body.vehicle_id,
      status: req.body.status,
      start_google_place_id: req.body.start_google_place_id,
      end_google_place_id: req.body.end_google_place_id,
    }

    const client = await pool.connect();
    const result = await client.query(
      "INSERT INTO rides (start_location, end_location, date, time, driver_id, vehicle_id, status, start_google_place_id, end_google_place_id) VALUES ('" + data.start_location +"', '"+ data.end_location + "', '" + data.date + "', '"+ data.time + "', '"+ data.driver_id + "', '"+ data.vehicle_id + "', '"+ data.status + "' , '"+ data.start_google_place_id + "' , '"+ data.end_google_place_id + "' )"
    );
    const results = { 'results': (result) ? result.rows : null};
    client.release();

    res.json({
      "message":"success",
      "data": results
    })

    } catch (err) {
      console.error(err);
      res.json({
        "message":"Error",
        "data": err
      })
    }
})


app.get('/api/search_rides', async (req, res) => {
  try {
    const data = {
      date: req.query.date
    }

    const client = await pool.connect();
    const result = await client.query("SELECT * FROM rides WHERE date = '" + data.date + "' ORDER BY id DESC");
    const results = { 'results': (result) ? result.rows : null};
    client.release();

    res.json({
      "message":"success",
      "data": results
    })

    } catch (err) {
      console.error(err);
      res.json({
        "message":"Error",
        "data": err
      })
    }
})


// app.get("/api/user/:id", (req, res, next) => {
//     var sql = "select * from user where id = ?"
//     var params = [req.params.id]
//     db.get(sql, params, (err, row) => {
//         if (err) {
//           res.status(400).json({"error":err.message});
//           return;
//         }
//         res.json({
//             "message":"success",
//             "data":row
//         })
//       });
// });


// app.post("/api/user/", (req, res, next) => {
//     var errors=[]
//     if (!req.body.password){
//         errors.push("No password specified");
//     }
//     if (!req.body.email){
//         errors.push("No email specified");
//     }
//     if (errors.length){
//         res.status(400).json({"error":errors.join(",")});
//         return;
//     }
//     var data = {
//         name: req.body.name,
//         email: req.body.email,
//         password : md5(req.body.password)
//     }
//     var sql ='INSERT INTO user (name, email, password) VALUES (?,?,?)'
//     var params =[data.name, data.email, data.password]
//     db.run(sql, params, function (err, result) {
//         if (err){
//             res.status(400).json({"error": err.message})
//             return;
//         }
//         res.json({
//             "message": "success",
//             "data": data,
//             "id" : this.lastID
//         })
//     });
// })



// Root path
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});