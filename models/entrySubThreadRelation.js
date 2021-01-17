'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class EntrySubThreadRelation extends Model {
        static associate(models) {
            EntrySubThreadRelation.belongsTo(models.SubThread, {
                onDelete: 'CASCADE'
            });
            
            EntrySubThreadRelation.belongsTo(models.Entry, {
                onDelete: 'CASCADE'
            });
        }
    };

    EntrySubThreadRelation.init({
        entry_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Entry',
                key: 'id',
                as: 'entry_id'
            }
        },
        sub_thread_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'SubThread',
                key: 'id',
                as: 'sub_thread_id'
            }
        }
    }, {
        sequelize,
        modelName: 'EntrySubThreadRelation',
        tableName: 'entry_sub_thread_relation',
        timestamps: false,
        underscored: true
    });

    return EntrySubThreadRelation;
};