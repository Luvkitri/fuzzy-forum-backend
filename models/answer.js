'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Answer extends Model {
        static associate(models) {
            Answer.belongsTo(models.User);
            Answer.belongsTo(models.Entry);
        }
    };

    Answer.init({
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        score: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 0
        },
        users_that_incremented: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            allowNull: true,
            defaultValue: []
        },
        users_that_decremented: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            allowNull: true,
            defaultValue: []
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'User',
                key: 'id',
                as: 'user_id'
            }
        },
        entry_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Entry',
                key: 'id',
                as: 'entry_id'
            }
        },
    }, {
        sequelize,
        modelName: 'Answer',
        tableName: 'answer',
        updatedAt: 'edited_at',
        createdAt: 'posted_at',
        underscored: true
    });

    return Answer;
};