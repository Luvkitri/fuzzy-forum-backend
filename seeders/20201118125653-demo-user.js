'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('user', [
            {
                first_name: 'John',
                last_name: 'Smith',
                email: 'example1@gmail.com',
                login: 'johnsmith13e4',
                password: 'ahsdhfg41',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                first_name: 'Martin',
                last_name: 'Diego',
                email: 'example2@gmail.com',
                login: 'martindiego11',
                password: 'ewgfiu134',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                first_name: 'Pedro',
                last_name: 'Rodrigez',
                email: 'example3@gmail.com',
                login: 'pedrorodrigez131',
                password: 'asodfhg972',
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('user', null, {
            truncate: true,
            cascade: true,
            restartIdentity: true
        });
    }
};
