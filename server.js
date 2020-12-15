const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');

// Passport config
require('./config/passport')(passport);

// Load env variables
dotenv.config({ path: './config/.env' });

let app = express();

// * Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         maxAge: 1000 * 60 * 60 * 24 * 7,
//         secure: process.env.ENV === 'production'
//     }
// }));

app.use(passport.initialize());
// app.use(passport.session());

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Routes
app.use(require('./routes'));

const port = process.env.PORT;
let server = app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});
