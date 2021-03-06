'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.hasMany(models.Entry, {
                foreignKey: 'user_id',
                onDelete: 'CASCADE'
            });
            
            User.hasMany(models.Answer, {
                foreignKey: 'user_id',
                onDelete: 'CASCADE'
            });
        }
    };

    User.init({
        first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            isEmail: true
        },
        login: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'user',
        updatedAt: 'updated_at',
        createdAt: 'created_at',
        underscored: true
    });

    return User;
};