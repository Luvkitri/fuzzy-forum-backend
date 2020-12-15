const express = require('express');
const router = express.Router();
const models = require('../models');
const { userValidationRules, validate } = require('../config/validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ExtractJwt } = require('passport-jwt');
const { issueJWT } = require('../lib/utils');

/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 */

router.post('/signup', userValidationRules(), validate, async (req, res) => {
    try {
        let {
            firstName,
            lastName,
            email,
            password,
            login
        } = req.body;

        let user = await models.User.findOne({ where: { email: email } });

        if (user) {
            return res.status(400).json({
                auth: false,
                error: "User Already Exists"
            });
        }

        if (login === "") {
            login = `${firstName} ${lastName}`
        }

        const newUser = models.User.build({
            first_name: firstName,
            last_name: lastName,
            email: email,
            login: login,
            password: password
        });

        newUser.password = await bcrypt.hash(newUser.password, 10);

        await newUser.save();

        const jwt = await issueJWT(newUser);

        res.status(201).json({
            auth: true,
            user: newUser,
            token: jwt.token,
            expiresIn: jwt.expires
        });
    } catch (error) {
        res.status(500).send({
            error: error.message
        });
    }
});


router.post('/login', async (req, res) => {
    try {
        let {
            email,
            password
        } = req.body;

        const user = await models.User.findOne({
            raw: true,
            where: {
                email: email
            }
        });

        if (!user) {
            return res.status(400).json({
                auth: false,
                error: "User Does Not Exists"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                auth: false,
                error: "Wrong password"
            });
        }

        const jwt = await issueJWT(user);

        res.status(201).json({
            auth: true,
            user: user,
            token: jwt.token,
            expiresIn: jwt.expires
        });
    } catch (error) {
        res.status(500).send({
            error: error.message
        });
    }
});

router.get('/auth', passport.authenticate('jwt', { session: false}), (req, res) => {
    res.status(200).json({
        auth: true,
        msg: 'User authorized'
    });
});

module.exports = router;