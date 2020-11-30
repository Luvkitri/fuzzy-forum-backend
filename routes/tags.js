const express = require('express');
const router = express.Router();
const models = require('../models');

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