'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Tag extends Model {
        static associate(models) {
            Tag.belongsToMany(models.Entry, { 
                as: 'EntriesInTags',
                through: models.EntryTagRelation,
                foreignKey: 'tag_id',
                otherKey: 'entry_id'
            });
        }
    };

    Tag.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        is_sub_thread: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        sequelize,
        modelName: 'Tag',
        tableName: 'tag',
        timestamps: false,
        underscored: true
    });

    return Tag;
};