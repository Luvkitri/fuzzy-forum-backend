const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/', async (req, res) => {
    try {
        const results = await models.Thread.findAll({
            include: [{
                model: models.SubThread,
                as: 'SubThreads',
                attributes: ['id', 'name', 'created_at']
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