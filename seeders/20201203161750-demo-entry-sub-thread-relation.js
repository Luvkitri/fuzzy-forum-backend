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
        await queryInterface.bulkInsert('entry_sub_thread_relation', [
            {
                entry_id: 1,
                sub_thread_id: 1
            },
            {
                entry_id: 1,
                sub_thread_id: 2
            },
            {
                entry_id: 2,
                sub_thread_id: 1
            },
            {
                entry_id: 3,
                sub_thread_id: 3
            },
            {
                entry_id: 5,
                sub_thread_id: 3
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */

        await queryInterface.bulkDelete('entry_sub_thread_relation', null, {
            truncate: true,
            cascade: true
        });
    }
};
