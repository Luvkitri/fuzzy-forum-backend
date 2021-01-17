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

        // Get all answers for given entry and update field
        const currentAnswers = await models.Answer.findAll({
            raw: true,
            where: {
                entry_id: entry_id
            }
        });

        updateAnswers = {
            answers: currentAnswers.length
        }

        await models.Entry.update(
            updateAnswers, {
            where: {
                id: entry_id
            }
        }
        )

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

router.post('/:answerId/score', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const answerId = req.params.answerId;
        const userId = req.user.id;
        const operation = req.body.score;

        const answer = await models.Answer.findOne({
            raw: true,
            where: {
                id: answerId
            }
        });

        // Check if answer exists
        if (!answer) {
            return res.status(404).send({
                success: false,
                error: "Answer does not exists."
            });
        }

        // Check if user owns this answer
        if (answer.user_id === userId) {
            return res.status(400).send({
                success: false,
                error: "You can't rate your answer."
            });
        }

        let updateObj = {};

        switch (operation) {
            case 'increment':
                // Check if user already incremented
                if (answer.users_that_incremented.includes(userId)) {
                    return res.status(400).send({
                        success: false,
                        error: "User already rated this answer."
                    });
                }

                updateObj.score = models.sequelize.literal('score + 1');

                // Check if user had decremented before
                if (answer.users_that_decremented.includes(userId)) {
                    updateObj.users_that_decremented = models.sequelize.fn(
                        'array_remove',
                        models.sequelize.col('users_that_decremented'),
                        req.user.id
                    );
                } else {
                    updateObj.users_that_incremented = models.sequelize.fn(
                        'array_append',
                        models.sequelize.col('users_that_incremented'),
                        req.user.id
                    );
                }
                break;
            case 'decrement':
                // Check if user already decremented
                if (answer.users_that_decremented.includes(userId)) {
                    return res.status(400).send({
                        success: false,
                        error: "User already rated this answer."
                    });
                }

                updateObj.score = models.sequelize.literal('score - 1');

                // Check if user had incremented before
                if (answer.users_that_incremented.includes(userId)) {
                    updateObj.users_that_incremented = models.sequelize.fn(
                        'array_remove',
                        models.sequelize.col('users_that_incremented'),
                        req.user.id
                    );
                } else {
                    updateObj.users_that_decremented = models.sequelize.fn(
                        'array_append',
                        models.sequelize.col('users_that_decremented'),
                        req.user.id
                    );
                }
                break;
            default:
                return res.status(400).send({
                    success: false,
                    error: "Unknow operation, try 'increment' or 'decrement'."
                });
        }

        await models.Answer.update(
            updateObj, {
                where: {
                    id: answerId
                }
            }
        );

        return res.status(200).json({
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            error: error.message
        });
    }
})

module.exports = router;
