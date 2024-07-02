import express from 'express';
const app = express(); // create express app
import connection from './db/db.js';
import userRoute from './routes/user.route.js';
import diningRoute from './routes/dining.route.js'
import adminRoute from './routes/admin.route.js'
import dotenv from 'dotenv';  
dotenv.config(); // to access the .env file

const PORT = process.env.PORT || 5000;

app.use(express.json()); // to recognize the incoming Request Object as a JSON Object

app.use('/users', userRoute); 
app.use('/dining-place', diningRoute);
app.use('/admin', adminRoute)


app.listen(PORT, () => { // start a server on port 5000
    console.log(`Server is running on port ${PORT}`);
})

