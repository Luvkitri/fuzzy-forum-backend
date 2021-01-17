const express = require('express');
const router = express.Router();
const models = require('../models');
const { signupValidationRules, loginValidationRules, validate } = require('../config/validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { issueJWT } = require('../lib/utils');

/**
 * @method - GET
 * @route - /users/
 * @description - Test route for authentication
 */
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
 * @method - GET
 * @route - /users/auth
 * @description - Test route for authentication
 */
router.get('/auth', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.status(200).json({
        auth: true,
        user: req.user,
        msg: 'User authorized'
    });
});

/**
 * @method - POST
 * @route - /users/signup
 * @description - Handle user signup
 */
router.post('/signup', signupValidationRules(), validate, async (req, res) => {
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
 * @route - /users/login
 * @description - Handle user login
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

/**
 * @method - GET
 * @route - /users/:userId
 * @description - Get user data by id
 */
router.get('/:userId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const userId = req.params.userId;

        const results = await models.User.findOne({
            where: {
                id: userId
            },
            attributes: ['id'],
            include: [
                {
                    model: models.Entry,
                    as: 'Entries',
                    attributes: ['id', 'title', 'score', 'answers', 'active'],
                },
                {
                    model: models.Answer,
                    as: 'Answers',
                    attributes: ['id', 'entry_id', 'score'],
                }
            ]
        });

        res.status(201).json({
            success: true,
            userData: results
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
