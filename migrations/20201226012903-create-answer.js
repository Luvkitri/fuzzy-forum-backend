'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('answer', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            score: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            users_that_incremented: {
                type: Sequelize.ARRAY(Sequelize.INTEGER),
                allowNull: true,
                defaultValue: []
            },
            users_that_decremented: {
                type: Sequelize.ARRAY(Sequelize.INTEGER),
                allowNull: true,
                defaultValue: []
            },
            posted_at: {
                type: Sequelize.DATE,
                allowNull: false
            },
            edited_at: {
                type: Sequelize.DATE,
                allowNull: false
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'user',
                    key: 'id'
                }
            },
            entry_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'entry',
                    key: 'id'
                }
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('answer');
    }
};
