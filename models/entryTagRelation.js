'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class EntryTagRelation extends Model {
        static associate(models) {
            EntryTagRelation.belongsTo(models.Tag, {
                onDelete: 'CASCADE'
            });
            EntryTagRelation.belongsTo(models.Entry, {
                onDelete: 'CASCADE'
            });
        }
    };

    EntryTagRelation.init({
        entry_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Entry',
                key: 'id',
                as: 'entry_id'
            }
        },
        tag_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Tag',
                key: 'id',
                as: 'tag_id'
            }
        }
    }, {
        sequelize,
        modelName: 'EntryTagRelation',
        tableName: 'entry_tag_relation',
        timestamps: false,
        underscored: true
    });

    return EntryTagRelation;
};