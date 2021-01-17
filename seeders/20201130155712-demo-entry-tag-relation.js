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
                tag_id: 3
            },
            {
                entry_id: 4,
                tag_id: 2
            },
            {
                entry_id: 5,
                tag_id: 3
            }
        ]);

        // Java
        await queryInterface.bulkInsert('entry_tag_relation', [
            {
                entry_id: 6,
                tag_id: 4
            },
            {
                entry_id: 7,
                tag_id: 4
            },
            {
                entry_id: 8,
                tag_id: 4
            },
            {
                entry_id: 9,
                tag_id: 4
            },
            {
                entry_id: 10,
                tag_id: 4
            },
            {
                entry_id: 11,
                tag_id: 4
            },
            {
                entry_id: 12,
                tag_id: 4
            },
            {
                entry_id: 13,
                tag_id: 4
            },
            {
                entry_id: 14,
                tag_id: 4
            },
            {
                entry_id: 15,
                tag_id: 4
            },
            {
                entry_id: 16,
                tag_id: 4
            },
            {
                entry_id: 17,
                tag_id: 4
            },
            {
                entry_id: 18,
                tag_id: 4
            },
        ]);

        // C++
        await queryInterface.bulkInsert('entry_tag_relation', [
            {
                entry_id: 19,
                tag_id: 5
            },
            {
                entry_id: 20,
                tag_id: 5
            },
            {
                entry_id: 21,
                tag_id: 5
            },
            {
                entry_id: 22,
                tag_id: 5
            },
            {
                entry_id: 23,
                tag_id: 5
            },
            {
                entry_id: 24,
                tag_id: 5
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

        await queryInterface.bulkDelete('entry_tag_relation', null, {
            truncate: true,
            cascade: true
        });
    }
};
