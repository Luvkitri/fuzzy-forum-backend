const express = require('express');
const router = express.Router();
const models = require('../models');

/**
 * @method - GET
 * @route - /tags/
 * @description - Get all tags
 */
router.get('/', async (req, res) => {
    try {
        const results = await models.Tags.findAll();

        res.status(200).json(results);
    } catch (error) {
        res.status(500).send({
            error: error.message
        });
    }
});

/**
 * @method - GET
 * @route - /tags/relative
 * @description - Get all tags with entries that belong to those tags
 */
router.get('/relative', async (req, res) => {
    try {
        const results = await models.Tags.findAll({
            raw: true,
            include: [{
                model: models.Entry,
                as: 'EntriesInTags',
            }]
        })

        res.status(200).json(results);
    } catch (error) {
        res.status(500).send({
            error: error.message
        });
    }
});

module.exports = router;
