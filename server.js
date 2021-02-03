const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const passport = require('passport');

// Load env variables
dotenv.config({ path: './config/.env' });

// Passport config
require('./config/passport')(passport);

let app = express();

// * Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use(passport.initialize());

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Routes
app.use(require('./routes'));

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});
