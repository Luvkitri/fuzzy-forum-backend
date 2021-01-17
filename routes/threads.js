const express = require('express');
const router = express.Router();
const models = require('../models');

/**
 * @method - GET
 * @route - /thread/
 * @description - Get all threads
 */
router.get('/', async (req, res) => {
    try {
        const results = await models.Thread.findAll({
            include: [{
                model: models.SubThread,
                as: 'SubThreads',
                attributes: ['id', 'name']
            }]
        });

        res.status(200).json(results);
    } catch (error) {
        res.status(500).send({
            error: error.message
        });
    }
});

module.exports = router;
