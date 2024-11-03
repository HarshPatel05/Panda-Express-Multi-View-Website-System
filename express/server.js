/*

Example fetch request for frontend people to get information from database 

fetch('http://localhost:5000/api/employees')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

*/


/** Initial Setup and Configuration
 *  Express is required to create and manage the web server.
 *  pg is the PostgreSQL client for Node.js, allowing us to connect to and query a PostgreSQL database.
 *  dotenv is used to load environment variables from a .env file
**/
const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();


/** Create the Express App and Enable CORS
 * app is the main Express application.
 * CORS (Cross-Origin Resource Sharing) is enabled to allow the frontend (running on a different port) to communicate with this server.
 */
const app = express();
const cors = require('cors');
app.use(cors());


/** Database Connection Pool
 * Pool is used to manage a group of connections to the database
 */
const pool = new Pool({
user: process.env.PSQL_USER,
host: process.env.PSQL_HOST,
database: process.env.PSQL_DATABASE,
password: process.env.PSQL_PASSWORD,
port: process.env.PSQL_PORT,
ssl: {rejectUnauthorized: false}
})

// This code establishes a connection to the database and logs a message to confirm the connection or to print any errors.
pool.connect()
  .then(() => console.log('Connected to the database'))
  .catch((err) => console.error('Database connection error:', err.stack));



/**
 * Frontend code to get a menu item’s ID by name:
 * 
 * fetch('http://localhost:5000/api/menu/Burger')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));

*/
// API Request to get menuItemId by menuItem name
app.get('/api/menu/:name', async (req, res) => { 

  const menuName = req.params.name;  // Extract menuName from request parameters
  
  try 
  {
    // Query the database for menuItemId by menuItem name
    const result = await pool.query( 'SELECT menuitemID FROM menuitems WHERE menuitem = $1', [menuName] );
      
    // Check if a matching menu item was found
    if (result.rows.length > 0)
    {
      // If true, it sends a JSON response with the menuItemId from the first row
      res.json({ menuItemId: result.rows[0].menuItemid });
    }
    else
    {
      // If no rows were found, it sends a 404 (Not Found) status with a message, indicating the item doesn’t exist in the database
      res.status(404).json({ message: 'Menu item not found' });
    }
  } 
  catch (err) // catch any error while querying the database
  {
    console.error('Error fetching menu item:', err.stack);
    res.status(500).send('Server error');
  }

});


  
// API Request to get list of employees
app.get('/api/employees', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM employees');  
      res.json(result.rows); 
    } catch (err) {
      console.error('Error fetching employees:', err.stack);
      res.status(500).send('Server error');
    }
  });


// API Request to get list of order history 
app.get('/api/orderhistory', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM orderhistory');  
      res.json(result.rows); 
    } catch (err) {
      console.error('Error fetching orderhistory:', err.stack);
      res.status(500).send('Server error');
    }
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});