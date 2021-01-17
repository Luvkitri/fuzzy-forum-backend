const express = require('express');
const router = express.Router();
const models = require('../models');
const passport = require('passport');
const { firstLetter } = require('../lib/utils');
const { fuzzyProcess } = require('..//lib/fuzzy');

/**
 * @method - GET
 * @route - /entries/
 * @description - Get all entries
 */
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
                    model: models.SubThread,
                    as: 'SubThreadsInEntry',
                    through: {
                        attributes: []
                    }
                },
                {
                    model: models.User,
                    as: 'User',
                    attributes: ['first_name', 'last_name']
                }
            ],
            order: [['posted_at', 'DESC']],
        });

        res.status(200).json(results);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: error.message
        });
    }
});

/**
 * @method - GET
 * @route - /entries/:entryId
 * @description - Get entry by id
 */
router.get('/:entryId', async (req, res) => {
    try {
        const entryId = req.params.entryId;

        const results = await models.Entry.findOne({
            where: {
                id: entryId
            },
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
                    model: models.SubThread,
                    as: 'SubThreadsInEntry',
                    through: {
                        attributes: []
                    }
                },
                {
                    model: models.User,
                    as: 'User',
                    attributes: ['first_name', 'last_name']
                },
                {
                    model: models.Answer,
                    as: 'Answers',
                    attributes: ['id', 'content', 'score', 'posted_at', 'edited_at', 'user_id', 'entry_id'],
                    include: [{
                        model: models.User,
                        as: 'User',
                        attributes: ['first_name', 'last_name'],
                    }]
                }
            ],
        });

        if (!results) {
            res.status(404).send({
                success: false,
                error: "Entry does not exist"
            });
        }

        res.status(200).json({
            success: true,
            entry: results
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error: error.message
        });
    }
});

/**
 * @method - GET
 * @route - /entries/thread/:threadId
 * @description - Get all entries that belongs to thread given by id
 */
router.get('/thread/:threadId', async (req, res) => {
    try {
        const threadId = req.params.threadId;

        const results = await models.Entry.findAll({
            where: {
                thread_id: threadId
            },
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
                    model: models.SubThread,
                    as: 'SubThreadsInEntry',
                    through: {
                        attributes: []
                    }
                },
                {
                    model: models.User,
                    as: 'User',
                    attributes: ['first_name', 'last_name']
                }
            ],
            order: [['posted_at', 'DESC']],
        });

        if (!results) {
            res.status(404).send({
                success: false,
                error: "Entry does not exist"
            });
        }

        res.status(200).json({
            success: true,
            entries: results
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error: error.message
        });
    }
});

/**
 * @method - GET
 * @route - /entries/subThread/:subThreadId
 * @description - Get all entries that belongs to subthread given by id
 */
router.get('/subthread/:subThreadId', async (req, res) => {
    try {
        const subThreadId = req.params.subThreadId;

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
                    model: models.SubThread,
                    as: 'SubThreadsInEntry',
                    where: {
                        id: subThreadId
                    },
                    through: {
                        attributes: []
                    }
                },
                {
                    model: models.User,
                    as: 'User',
                    attributes: ['first_name', 'last_name']
                }
            ],
            order: [['posted_at', 'DESC']],
        });

        if (!results) {
            res.status(404).send({
                success: false,
                error: "Entry does not exist"
            });
        }

        res.status(200).json({
            success: true,
            entries: results
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error: error.message
        });
    }
});

/**
 * @method - POST
 * @route - /entries/score
 * @description - Update entry score
 */
router.post('/:entryId/score', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const entryId = req.params.entryId;
        const userId = req.user.id;
        const operation = req.body.score;

        const entry = await models.Entry.findOne({
            raw: true,
            where: {
                id: entryId
            }
        });

        // Check if entry exists
        if (!entry) {
            return res.status(404).send({
                success: false,
                error: "Entry does not exists."
            });
        }

        // Check if user owns this entry
        if (entry.user_id === userId) {
            return res.status(400).send({
                success: false,
                error: "You can't rate your entry."
            });
        }

        // Construct update object
        let updateObj = {};

        switch (operation) {
            case 'increment':
                // Check if user already incremented
                if (entry.users_that_incremented.includes(userId)) {
                    return res.status(400).send({
                        success: false,
                        error: "User already rated this entry."
                    });
                }

                updateObj.score = models.sequelize.literal('score + 1');

                // Check if user had decremented before
                if (entry.users_that_decremented.includes(userId)) {
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
                if (entry.users_that_decremented.includes(userId)) {
                    return res.status(400).send({
                        success: false,
                        error: "User already rated this entry."
                    });
                }

                updateObj.score = models.sequelize.literal('score - 1');

                // Check if user had incremented before
                if (entry.users_that_incremented.includes(userId)) {
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

        await models.Entry.update(
            updateObj, {
            where: {
                id: entryId
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
});

/**
 * @method - POST
 * @route - /entries/add
 * @description - Add an entry update relations and check with fuzzy generator whether to create a new subThread
 */
router.post('/add', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        let {
            title,
            content,
            user_id,
            thread_id,
            entryTags
        } = req.body;

        // Create and insert a entry
        const entryData = {
            title: title,
            content: content,
            user_id: user_id,
            thread_id: thread_id,
            posted_at: new Date(),
            edited_at: new Date(),
        }

        const newEntry = models.Entry.build(entryData);
        await newEntry.save();

        const tags = await models.Tag.findAll();

        // For each tag in db match and match with those passed by user
        let matchingTags = [];
        entryTags.forEach((entryTag, index, entryTagsObject) => {
            const matchingTag = tags.find(tag => tag.name === entryTag);

            // If db tag is matching with given tag pass it to matching tags
            if (matchingTag !== undefined) {
                matchingTag.dataValues.name = firstLetter(matchingTag.dataValues.name);
                matchingTags.push(matchingTag.dataValues);

                // Nullify tags that are matching
                entryTagsObject[index] = null;
            } else {
                // Replace a new tag name with same name but first letter uppercase
                entryTagsObject[index] = { name: firstLetter(entryTag) };
            }
        });

        // Remove tags passed by user that got nullified
        entryTags = entryTags.filter(tag => tag !== null);

        // Check if there are matching tags
        let nonSubThreadTags = [];
        if (Array.isArray(matchingTags) && matchingTags.length) {
            const subThreads = await models.SubThread.findAll({ raw: true });

            // Find all existing subthreads that are created for already existing tags
            let existingSubThreads = [];
            matchingTags.forEach(matchingTag => {
                const subThread = subThreads.find(subThread => subThread.name === matchingTag.name);
                if (subThread !== undefined) {
                    existingSubThreads.push(subThread);
                } else {
                    nonSubThreadTags.push(matchingTag);
                }
            });

            // Update relations of entries with subthreads
            let entrySubThreadRelations = [];
            existingSubThreads.forEach(existingSubThread => {
                entrySubThreadRelations.push({
                    entry_id: newEntry.id,
                    sub_thread_id: existingSubThread.id
                });
            });

            await models.EntrySubThreadRelation.bulkCreate(entrySubThreadRelations);
        }

        // After adding all new tags combine already existing tags with new ones
        let selectedTags = matchingTags;
        if (Array.isArray(entryTags) && entryTags.length) {
            const insertedTags = await models.Tag.bulkCreate(entryTags);
            selectedTags = selectedTags.concat(insertedTags);;
        }

        // Update entry tag relations
        let relations = []
        selectedTags.forEach(selectedTag => {
            relations.push({
                entry_id: newEntry.id,
                tag_id: selectedTag.id
            });
        });

        await models.EntryTagRelation.bulkCreate(relations);

        res.status(201).json({
            success: true,
        });

        for (const tag of nonSubThreadTags) {
            const createSubThread = await fuzzyProcess(tag.name);

            if (createSubThread) {
                const subThreadData = {
                    name: tag.name,
                    thread_id: thread_id
                }

                // Insert new subthread
                const newSubThread = await models.SubThread.create(subThreadData);

                // Find all entries with that tag
                const entries = await models.Entry.findAll({
                    include: {
                        model: models.Tag,
                        as: 'TagsInEntries',
                        where: {
                            name: tag.name
                        }
                    }
                });

                // Create relations
                let entrySubThreadRelations = [];

                entries.forEach(entry => {
                    entrySubThreadRelations.push({
                        entry_id: entry.id,
                        sub_thread_id: newSubThread.id
                    })
                });

                await models.EntrySubThreadRelation.bulkCreate(entrySubThreadRelations);
            }
        }

        return;
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
