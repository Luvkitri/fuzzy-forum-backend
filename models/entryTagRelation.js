'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class EntryTagRelation extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
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