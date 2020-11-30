'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Thread extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Thread.hasMany(models.SubThread, {
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