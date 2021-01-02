const models = require('../models');

const tagsFrequency = async () => {
    try {
        // Require all tags from entries
        const result = await models.Entry.findAll({
            raw: true,
            include: [
                {
                    model: models.Tag,
                    as: 'TagsInEntries',
                    through: {
                        attributes: []
                    }
                },
            ],
            attributes: ['TagsInEntries.name']
        });

        // Create list of those tags
        const tags = result.map(tagObj => tagObj.name);
        console.log(tags);

        frequencies = []

    } catch (error) {
        console.error(error);
    }
}


module.exports = {
    tagsFrequency: tagsFrequency,

}