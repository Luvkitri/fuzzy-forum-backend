'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('answer', [
            {
                content: "Answer to the entry 1",
                posted_at: new Date(),
                edited_at: new Date(),
                user_id: 1,
                entry_id: 1,
            },
            {
                content: "Answer to the entry 2",
                posted_at: new Date(),
                edited_at: new Date(),
                user_id: 1,
                entry_id: 1,
            },
            {
                content: "Answer to the entry 3",
                posted_at: new Date(),
                edited_at: new Date(),
                user_id: 1,
                entry_id: 2,
            },
            {
                content: "Answer to the entry 4",
                posted_at: new Date(),
                edited_at: new Date(),
                user_id: 1,
                entry_id: 2,
            },
            {
                content: "Answer to the entry 5",
                posted_at: new Date(),
                edited_at: new Date(),
                user_id: 1,
                entry_id: 3,
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('answer', null, {
            truncate: true,
            cascade: true,
            restartIdentity: true
        });
    }
};
