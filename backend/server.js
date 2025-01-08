const express = require('express');
const mysql = require('mysql2/promise'); 
const dotenv = require('dotenv');

const app = express();
const port = process.env.PORT || 5000;

console.log('port',port)
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.use(express.json());

app.get('/users', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM users'); 
    res.json({ data : results, code : 200, message : "user get data success" }); 
  } catch (err) {
    console.error("Database error:", err);
    res.json({ code : 500, message: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
