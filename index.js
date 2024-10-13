require('dotenv').config();
const express = require('express');
const path = require("path");
const ejs = require('ejs');
const userroute = require('./router/user');
const blogroute = require('./router/blog');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { checkauthenticationcookie } = require('./middleware/authentication');
const Blog = require('./model/blog');

const app = express();
const PORT = process.env.PORT || 8005; // Default to 8005 if PORT is not set

// Debugging line to check the MONGO_URL
console.log("MONGO_URL:", process.env.MONGO_URL); // Add this line
console.log("All environment variables: ", process.env);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {})
    .then(() => {
        console.log("DB Connected");
    })
    .catch((error) => {
        console.error("DB Connection Error: ", error);
    });

// Set EJS as the view engine
app.set("view engine", 'ejs');
app.set("views", path.resolve("views"));

// Middleware setup
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkauthenticationcookie('token'));
app.use(express.static(path.resolve("./public")));

// Home route
app.get('/', async (req, res) => {
    const allblog = await Blog.find({});
    return res.render('home', {
        user: req.user,
        blogs: allblog
    });
});

// Routes
app.use('/user', userroute);
app.use('/blog', blogroute);

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
