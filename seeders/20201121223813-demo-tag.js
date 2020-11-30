'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('tag', [
            {
                name: "python"
            },
            {
                name: "algorithms"
            },
            {
                name: "books"
            },
            {
                name: "reviews"
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
            cascade: true,
            restartIdentity: true
        });
    }
};
