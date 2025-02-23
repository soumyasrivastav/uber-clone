const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const connectToDb = require('./db/db');
const userRoutes = require('./routes/user.routes');

// Connect to the database
connectToDb();

// Debugging middleware to log incoming requests
app.use((req, res, next) => {
    console.log("Incoming Request:", req.method, req.url);
    console.log("Request Body:", req.body);
    console.log("Request Headers:", req.headers);
    next();
});

// Middleware setup
app.use(cors());
app.use(express.json());  
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());

// Basic route to check server status
app.get('/', (req, res) => {
    res.send('Server is running');
});

// User routes
app.use('/users', userRoutes); 

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;


