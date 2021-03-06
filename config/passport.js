const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const models = require('../models');
const { getPublicKey } = require('../lib/utils');

const User = models.User;

const PUB_KEY = getPublicKey();

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithms: ['RS256']
}

module.exports = (passport) => {
    // JWT Strategy
    passport.use(
        new JwtStrategy(options, async (payload, done) => {
            try {
                const user = await User.findOne({
                    where: {
                        id: payload.sub
                    },
                    attributes: [
                        'id',
                        'first_name',
                        'last_name',
                        'email',
                        'login',
                        'updated_at',
                        'created_at'
                    ]
                });

                if (!user) {
                    return done(null, false);
                }

                return done(null, user.dataValues);
            } catch (error) {
                console.log(error.message);
                done(error, null);
            }
        })
    )
}