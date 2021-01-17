'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */

        await queryInterface.createTable('entry', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            title: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            content: {
                type: Sequelize.TEXT,
            },
            score: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            answers: {
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
            active: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'user',
                    key: 'id'
                }
            },
            thread_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'thread',
                    key: 'id'
                }
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */

        await queryInterface.dropTable('entry');
    }
};
