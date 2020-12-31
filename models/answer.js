'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Answer extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
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