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
                title: "Test entry 1",
                content: "Entry with content",
                posted_at: new Date(),
                edited_at: new Date(),
                active: true,
                user_id: 1,
                sub_thread_id: 1
            },
            {
                title: "Test entry 2",
                posted_at: new Date(),
                edited_at: new Date(),
                active: true,
                user_id: 1,
                sub_thread_id: 1
            },
            {
                title: "Test entry 3",
                content: "Entry with content",
                posted_at: new Date(),
                edited_at: new Date(),
                active: true,
                user_id: 1,
            },
            {
                title: "Test disactivated entry 4",
                content: "Bad content",
                posted_at: new Date(),
                edited_at: new Date(),
                active: false,
                user_id: 1,
                sub_thread_id: 2
            },
            {
                title: "Test entry 4",
                content: "Entry with content",
                posted_at: new Date(),
                edited_at: new Date(),
                active: true,
                user_id: 2,
                sub_thread_id: 2
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
