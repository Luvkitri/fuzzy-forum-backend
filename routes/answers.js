const express = require('express');
const router = express.Router();
const passport = require('passport');
const models = require('../models');

router.post('/add', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        let {
            content,
            user_id,
            entry_id,
        } = req.body;

        const answerData = {
            content: content,
            user_id: user_id,
            entry_id: entry_id,
            posted_at: new Date(),
            edited_at: new Date(),
        }

        const newAnswer = models.Answer.build(answerData);
        await newAnswer.save();

        res.status(201).json({
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
