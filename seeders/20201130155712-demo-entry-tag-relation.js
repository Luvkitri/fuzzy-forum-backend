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
        await queryInterface.bulkInsert('entry_tag_relation', [
            {
                entry_id: 1,
                tag_id: 1
            },
            {
                entry_id: 1,
                tag_id: 2
            },
            {
                entry_id: 2,
                tag_id: 1
            },
            {
                entry_id: 3,
                tag_id: 2
            },
            {
                entry_id: 4,
                tag_id: 3
            },
            {
                entry_id: 5,
                tag_id: 3
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

        await queryInterface.bulkDelete('entry_tag_relation', null, {
            truncate: true,
            cascade: true
        });
    }
};
