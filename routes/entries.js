const express = require('express');
const router = express.Router();
const models = require('../models');
const passport = require('passport');
const entry = require('../models/entry');
const { firstLetter } = require('../lib/utils');
const { tagsFrequency } = require('../lib/fuzzy');

router.get('/', async (req, res) => {
    try {

        // ! Testing
        await tagsFrequency();

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

router.post('/add', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        let {
            title,
            content,
            user_id,
            thread_id,
            entryTags
        } = req.body;

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

        let matchingTags = [];
        entryTags.forEach((entryTag, index, entryTagsObject) => {
            const matchingTag = tags.filter(tag => tag.name === entryTag)[0];

            if (matchingTag) {
                matchingTag.dataValues.name = firstLetter(matchingTag.dataValues.name);
                matchingTags.push(matchingTag.dataValues);
                entryTagsObject[index] = null;
            } else {
                entryTagsObject[index] = { name: firstLetter(entryTag) };
            }
        });

        entryTags = entryTags.filter(tag => tag !== null);

        if (matchingTags) {
            const subThreads = await models.SubThread.findAll({ raw: true });

            let existingSubThreads = [];
            matchingTags.forEach(matchingTag => {
                existingSubThreads.push(subThreads.filter(subThread => subThread.name === matchingTag.name)[0]);
            });

            let entrySubThreadRelations = [];
            existingSubThreads.forEach(existingSubThread => {
                entrySubThreadRelations.push({
                    entry_id: newEntry.id,
                    sub_thread_id: existingSubThread.id
                });
            });

            await models.EntrySubThreadRelation.bulkCreate(entrySubThreadRelations);
        }

        let selectedTags = matchingTags;
        if (entryTags) {
            const insertedTags = await models.Tag.bulkCreate(entryTags);
            selectedTags = selectedTags.concat(insertedTags);;
        }


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
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
