const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/', async (req, res) => {
    try {
        const results = await models.Entry.findAll({
            include: [
                {
                    model: models.Tag,
                    as: 'TagsInEntries',
                    through: {
                        attributes: []
                    }
                },
                {
                    model: models.Thread,
                    as: 'Thread',
                },
                {
                    model: models.User,
                    as: 'User',
                    attributes: ['first_name', 'last_name']
                }
            ]
        });

        res.status(200).json(results);
    } catch (error) {
        res.status(500).send({
            error: error.message
        });
    }
});

router.put('/:entryId', async (req, res) => {

});

module.exports = router;