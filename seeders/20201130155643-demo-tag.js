'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('tag', [
            {
                name: "python"
            },
            {
                name: "algorithm"
            },
            {
                name: "review"
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

        await queryInterface.bulkDelete('tag', null, {
            truncate: true,
            cascade: true,
            restartIdentity: true
        });
    }
};
