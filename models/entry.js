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
            Entry.belongsTo(models.Thread);

            Entry.hasMany(models.Answer, {
                foreignKey: 'entry_id',
                onDelete: 'CASCADE'
            });

            Entry.belongsToMany(models.Tag, { 
                as: 'TagsInEntries',
                through: models.EntryTagRelation,
                foreignKey: 'entry_id',
                otherKey: 'tag_id'
            });

            Entry.belongsToMany(models.SubThread, { 
                as: 'SubThreadsInEntry',
                through: models.EntrySubThreadRelation,
                foreignKey: 'entry_id',
                otherKey: 'sub_thread_id'
            });
        }
    };

    Entry.init({
        title: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        score: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 0
        },
        answers: {
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
        thread_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Thread',
                key: 'id',
                as: 'thread_id'
            }
        },
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