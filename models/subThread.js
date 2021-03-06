'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class SubThread extends Model {
        static associate(models) {
            SubThread.belongsTo(models.Thread);

            SubThread.belongsToMany(models.Entry, { 
                as: 'EntriesInSubThread',
                through: models.EntrySubThreadRelation,
                foreignKey: 'sub_thread_id',
                otherKey: 'entry_id'
            });
        }
    };

    SubThread.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        thread_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Thread',
                key: 'id',
                as: 'thread_id'
            }
        }
    }, {
        sequelize,
        modelName: 'SubThread',
        tableName: 'sub_thread',
        timestamps: false,
        underscored: true
    });

    return SubThread;
};