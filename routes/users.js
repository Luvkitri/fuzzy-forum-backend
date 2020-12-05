const express = require('express');
const router = express.Router();
const models = require('../models');

/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 */

router.post('/signup', async (req, res) => {
    try {
        const { 
            firstName, 
            lastName, 
            email, 
            password, 
            confirmPassword,
            login
        }

    } catch (error) {
        res.status(500).send({
            error: error.message
        });
    }
});

module.exports = router;