const models = require('../models');
const { Op } = require('sequelize');

// fuzzy
const Logic = require('es6-fuzz')
const Triangle = require('es6-fuzz/lib/curve/triangle');
const Sigmoid = require('es6-fuzz/lib/curve/sigmoid');

const tagFrequency = async (tagName) => {
    try {
        // Require all tags from entries
        const results = await models.Entry.findAll({
            raw: true,
            include: [
                {
                    model: models.Tag,
                    as: 'TagsInEntries',
                    through: {
                        attributes: []
                    },
                    where: {
                        name: tagName,
                    }
                },
            ],
            attributes: ['TagsInEntries.name']
        });

        return results.length;
    } catch (error) {
        console.error(error);
    }
}

const tagTrend = async (tagName) => {
    try {
        const threeDaysAgo = new Date(new Date().setDate(new Date().getDate() - 3));

        const results = await models.Entry.findAll({
            raw: true,
            include: [
                {
                    model: models.Tag,
                    as: 'TagsInEntries',
                    through: {
                        attributes: []
                    },
                    where: {
                        name: tagName,
                    }
                },
            ],
            where: {
                posted_at: {
                    [Op.gt]: threeDaysAgo,
                    [Op.lt]: new Date()
                }
            },
            attributes: ['TagsInEntries.name']
        });

        return results.length;
    } catch (error) {
        console.error(error)
    }
}

const fuzzyProcess = async (tagName) => {
    // FUZZY
    const frequency = await tagFrequency(tagName);
    const trend = await tagTrend(tagName);

    console.log(frequency);
    console.log(trend);

    let logic = new Logic();

    // * 1. Fuzzification
    const frequencyData = logic
        .init('small', new Sigmoid(5.6, -0.7))
        .or('medium', new Triangle(5, 10, 15))
        .or('large', new Sigmoid(14.4, 0.7))
        .defuzzify(frequency);

    logic = new Logic();

    const trendData = logic
        .init('small', new Sigmoid(5.1, -0.3))
        .or('medium', new Triangle(2, 7, 12))
        .or('large', new Sigmoid(8.9, 0.3))
        .defuzzify(trend);

    console.log(frequencyData);
    console.log(trendData);

    // Frequency fuzzified values
    const u_frequency_small = frequencyData.rules.find(rule => rule.output === 'small').fuzzy;
    const u_frequency_medium = frequencyData.rules.find(rule => rule.output === 'medium').fuzzy;
    const u_frequency_large = frequencyData.rules.find(rule => rule.output === 'large').fuzzy;

    // Trend fuzzified values
    const u_trend_small = trendData.rules.find(rule => rule.output === 'small').fuzzy;
    const u_trend_medium = trendData.rules.find(rule => rule.output === 'medium').fuzzy;
    const u_trend_large = trendData.rules.find(rule => rule.output === 'large').fuzzy;

    console.log(`here ${trendData.rules.find(rule => rule.output === 'small').fuzzy}`);

    // * 2. Rules
    // r1: IF frequency IS large OR trend IS large THEN create_subthread IS positive
    // r2: IF frequency IS medium AND trend IS medium THEN create_subthread IS positive
    // r3: IF frequency IS small AND trend IS small THEN create_subthread IS negative
    // r4: IF frequency IS small AND trend IS medium THEN create_subthread IS negative
    // r5: IF frequency IS medium AND trend IS small THEN create_subthread IS negative

    // positive
    const r1 = Math.max(u_frequency_large, u_trend_large);
    const r2 = Math.min(u_frequency_medium, u_trend_medium);

    // negative
    const r3 = Math.min(u_frequency_small, u_trend_small);
    const r4 = Math.min(u_frequency_small, u_trend_medium);
    const r5 = Math.min(u_frequency_medium, u_trend_small);

    // * 3. Rules Agregation

    const negative = Math.max(r3, r4, r5);
    const positive = Math.max(r1, r2);

    console.log(negative);
    console.log(positive);

    // * 4. Defuzzyfy
    if (positive >= negative) {
        console.log("Create a subthread");
        return true;
    }

    console.log("Do not create a subthread");

    return false;
}

module.exports = {
    tagFrequency: tagFrequency,
    tagTrend: tagTrend,
    fuzzyProcess: fuzzyProcess
}