const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const { User } = require('../../models/user');
const { comparePassword } = require('../helper');

passport.use(new LocalStrategy(
	{
		usernameField: 'email',
		passwordField: 'password'
	},
	async (email, password, done) => {
		try {
			if(!email || !password) {
				return done(new Error('Incorrect email or password'), null);
			}

			const user = await User.findOne({ email });
			if(!user) {
				return done(new Error('Incorrect email or password'), null);
			}

			const isValid = await comparePassword(password, user.password);
			if(!isValid) {
				return done(new Error('Incorrect email or password'), null);
			}

			done(null, user);
			
		} catch(err) {
			done(err, null);
		}
	}
));

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findById(id);
		if(!user) {
			return done(new Error('Invalid Credentials'), null);
		}

		done(null, user);
		
	} catch(err) {
		done(err, null);
	}
});

module.exports = passport
