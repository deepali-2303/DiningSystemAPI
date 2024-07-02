import mysql from 'mysql';
import dotenv from 'dotenv';
import createDiningSchema from '../models/dining.model.js';
import createUserSchema from '../models/user.model.js'; 
import createAdminSchema from '../models/admin.model.js';
dotenv.config();

const connection = mysql.createConnection({ 
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}); 

connection.connect((e) => { 
  if(e){
    console.log("Error connecting to database : ", e);
    return;
  }
  else{
    console.log("Successfully connected to database");
    createDiningSchema();
    createUserSchema();
    createAdminSchema();
  }
})




export default connection;