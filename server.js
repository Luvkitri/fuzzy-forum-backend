const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');

// Load env variables
dotenv.config({ path: './config/.env' });

let app = express();

// * Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Routes
app.use('/entries', require('./routes/entries'));
app.use('/threads', require('./routes/threads'));

const port = process.env.PORT;
let server = app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});
