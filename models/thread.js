'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Thread extends Model {
        static associate(models) {
            Thread.hasMany(models.SubThread, {
                foreignKey: 'thread_id',
                onDelete: 'CASCADE'
            });
            
            Thread.hasMany(models.Entry, {
                foreignKey: 'thread_id',
                onDelete: 'CASCADE'
            });
        }
    };

    Thread.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Thread',
        tableName: 'thread',
        timestamps: false,
        underscored: true
    });

    return Thread;
};