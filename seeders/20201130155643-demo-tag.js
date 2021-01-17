'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('tag', [
            {
                name: "Python",
                is_sub_thread: true
            },
            {
                name: "Algorithm",
                is_sub_thread: true
            },
            {
                name: "Review",
                is_sub_thread: true
            },
            {
                name: "Java",
                is_sub_thread: false
            },
            {
                name: "C++",
                is_sub_thread: false
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('tag', null, {
            truncate: true,
            cascade: true,
            restartIdentity: true
        });
    }
};
