const LocalStrategy = require('passport-local').Strategy;
const models = require('../models');
const bycrypt = require('bcryptjs');

const User = models.User;

module.exports = function (passport) {
    // Local Strategy
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            try {
                const user = await User.findOne({
                    where: {
                        email: email
                    }
                });

                if (!user) {
                    return done(null, false, { message: 'There is no user with that email' });
                }

                bycrypt.compare(password, user.password, (error, isMatch) => {
                    if (error) {
                        throw error;
                    }

                    if (isMatch) {
                        return done(null, user);
                    }

                    return done(null, false, { message: 'Wrong password' });
                });
            } catch (error) {
                console.error(error.message);
            }
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        try {
            const user = await User.findByPK(id);
            done(null, user);
        } catch(error) {
            done(error, false, { message: 'User does not exist'});
        }
    });

    // Google OAuth2.0 Strategy
}