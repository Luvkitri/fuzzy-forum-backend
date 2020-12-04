'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        await queryInterface.createTable('entry_tag_relation', {
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
            tag_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'tag',
                    key: 'id',
                    as: 'tag_id'
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
        await queryInterface.dropTable('entry_tag_relation');
    }
};
