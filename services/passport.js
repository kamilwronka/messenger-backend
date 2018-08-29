const passport = require('passport');
const User = require('../server/user/user');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local');

const localOptions = { usernameField: 'login' };
const localLogin = new LocalStrategy(localOptions, async (login, password, done) => {
	try {
		const user = await User.findByCredentials(login, password);
		if (!user) return done(null, false);

		return done(null, user);
	} catch (error) {
		done(error);
	}
});

const cookieExtractor = (req) => req.cookies.token;

const jwtOptions = {
	jwtFromRequest: cookieExtractor,
	secretOrKey: 'asda1231sda8sd7a87sa78sda8987dsa8da798sad8s7da88u7vucgj78'
};

const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
	try {
		const user = await User.findById(payload.sub);
		if (!user) return done(null, false);

		return done(null, user);
	} catch (error) {
		return done(error, false);
	}
});

passport.use(jwtLogin);
passport.use(localLogin);

module.exports = passport;
