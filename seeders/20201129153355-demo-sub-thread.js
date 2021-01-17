'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('sub_thread', [
            {
                name: "Python",
                thread_id: 1
            },
            {
                name: "Algorithm",
                thread_id: 1
            },
            {
                name: "Review",
                thread_id: 4
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('sub_thread', null, {
            truncate: true,
            cascade: true,
            restartIdentity: true
        });
    }
};
