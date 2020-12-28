const express = require('express');
const router = express.Router();
const models = require('../models');
const { userValidationRules, validate } = require('../config/validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { issueJWT } = require('../lib/utils');

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        res.status(500).send({
            error: error.message
        });
    }
});

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
                success: false,
                error: "User Already Exists"
            });
        }

        console.log(req.body);

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

        res.status(201).json({
            success: true,
            user: newUser
        });
    } catch (error) {
        res.status(500).send({
            error: error.message
        });
    }
});

/**
 * @method - POST
 * @param - /login
 * @description - User Login
 */
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

        const userData = {
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            login: user.login,
            email: user.email,
            updatedAt: user.updated_at,
            createdAt: user.created_at
        }

        res.status(201).json({
            auth: true,
            user: userData,
            token: jwt.token,
            expiresIn: jwt.expires
        });
    } catch (error) {
        res.status(500).send({
            error: error.message
        });
    }
});

router.get('/auth', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.status(200).json({
        auth: true,
        user: req.user,
        msg: 'User authorized'
    });
});

module.exports = router;