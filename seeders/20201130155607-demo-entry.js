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

        await queryInterface.bulkInsert('entry', [
            {
                title: "Programing type entry",
                content: "Entry with content",
                posted_at: new Date(),
                edited_at: new Date(),
                active: true,
                user_id: 1,
                thread_id: 1,
            },
            {
                title: "Programing type entry",
                posted_at: new Date(),
                edited_at: new Date(),
                active: true,
                user_id: 1,
                thread_id: 1,
            },
            {
                title: "Book type entry",
                content: "Entry with content",
                posted_at: new Date(),
                edited_at: new Date(),
                active: true,
                user_id: 1,
                thread_id: 4,
            },
            {
                title: "Programing disactivated entry",
                content: "Bad content",
                posted_at: new Date(),
                edited_at: new Date(),
                active: false,
                user_id: 1,
                thread_id: 1,
            },
            {
                title: "Book type entry",
                content: "Entry with content",
                posted_at: new Date(),
                edited_at: new Date(),
                active: true,
                user_id: 2,
                thread_id: 4,
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

        await queryInterface.bulkDelete('entry', null, {
            truncate: true,
            cascade: true,
            restartIdentity: true
        });
    }
};
