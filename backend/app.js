const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const app = express();
const connectToDb = require('./db/db');
const userRoutes = require('./routes/user.routes');

connectToDb();

// ✅ Log all requests before parsing JSON
app.use((req, res, next) => {
    console.log("🔥 Incoming Request:", req.method, req.url);
    console.log("🔥 Request Headers:", req.headers);
    next();
});

app.use(cors());
app.use(express.json());  // JSON Parsing
app.use(express.urlencoded({ extended: true }));  // Form Parsing

app.get('/', (req, res) => {
    res.send('hello world');
});

app.use('/users', userRoutes); // Routes should come after middleware

module.exports = app;

