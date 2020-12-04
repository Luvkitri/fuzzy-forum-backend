'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        await queryInterface.createTable('entry_sub_thread_relation', {
            entry_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'entry',
                    key: 'id',
                    as: 'entry_id'
                },
                onDelete: 'cascade'
            },
            sub_thread_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'sub_thread',
                    key: 'id',
                    as: 'sub_thread_id'
                },
                onDelete: 'cascade'
            }
        })
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.dropTable('entry_sub_thread_relation');
    }
};
