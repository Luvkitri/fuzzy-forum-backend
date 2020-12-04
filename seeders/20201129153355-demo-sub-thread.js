'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
        */

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
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('sub_thread', null, {
            truncate: true,
            cascade: true,
            restartIdentity: true
        });
    }
};
