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

        await queryInterface.bulkInsert('thread', [
            {
                name: "Programing"
            },
            {
                name: "Technology"
            },
            {
                name: "Music"
            },
            {
                name: "Books"
            },
            {
                name: "Sports"
            },
            {
                name: "Movies"
            },
            {
                name: "Others"
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
        await queryInterface.bulkDelete('thread', null, {
            truncate: true,
            cascade: true,
            restartIdentity: true
        });
    }
};
