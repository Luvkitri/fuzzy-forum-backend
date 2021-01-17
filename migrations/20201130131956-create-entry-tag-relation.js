'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
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
        await queryInterface.dropTable('entry_tag_relation');
    }
};
