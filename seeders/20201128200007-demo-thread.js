'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
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
        await queryInterface.bulkDelete('thread', null, {
            truncate: true,
            cascade: true,
            restartIdentity: true
        });
    }
};
