'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Entry extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Entry.belongsTo(models.User);

            Entry.belongsToMany(models.Tag, { 
                as: 'TagsInEntries',
                through: models.EntryTagRelation,
                foreignKey: 'entry_id',
                otherKey: 'tag_id'
            });
        }
    };

    Entry.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false
        },
        score: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 0
        },
        views: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 0
        },
        answers: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 0
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
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
        sub_thread_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'SubThread',
                key: 'id',
                as: 'sub_thread_id'
            }
        }
    }, {
        sequelize,
        modelName: 'Entry',
        tableName: 'entry',
        updatedAt: 'edited_at',
        createdAt: 'posted_at',
        underscored: true
    });

    return Entry;
};