const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const publicFolder = path.join(__dirname, 'public');

const { User } = require('./models/user');
const { isAuthenticated, isAdmin } = require('./controllers/auth');
const { hashPassword, comparePassword } = require('./controllers/helper');
const passport = require('./controllers/strategies/local');
const { body, validationResult } = require('express-validator');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicFolder));
app.use(session({
	secret: process.env.SESSION_SECRET_KEY,
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// app settings
app.set('view engine', 'ejs');
app.set('view cache', false);

const loadAllUsers = async () => {
	try {
		const users = await User.find({});
		console.log(users);
	} catch(err) {
		console.log('Failed to fetch all users', err.message);
	}
};

//loadAllUsers();

app.get('/signup', (req, res, next) => {
	try {
		res.render('signup');
	} catch(err) {
		next(err);
	}
});

app.post('/signup',
	body('name').trim().notEmpty().withMessage('Name is required'),
	body('email').isEmail().withMessage('Invalid email address'),
	body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
	body('role').isIn([ 'regular', 'admin' ]).withMessage('Invalid role'),
	async (req, res, next) => {
	try {
		const errors = validationResult(req);
		if(!errors.isEmpty()) {
			return res.status(400).send(errors.array().map(err => err.msg).join('<br>'));
		}

		const { name, email, password, role } = req.body;

		const user = await User.findOne({ email });
		if(user) {
			//return res.send('Invalid Credentials, User already registered');
			return res.redirect('/login');
		}

		const hashedPassword = await hashPassword(password);
		const name2 = name.charAt(0).toUpperCase() + name.slice(1);

		const newUser = new User({
			name: name2,
			email,
			password: hashedPassword,
			role
		});

		await newUser.save();
		res.status(201).send('New User Registered Successfully! Now <a href="/login"> Login </a> to Continue.');
		
	} catch(err) {
		next(err);
	}
});

app.get('/login', (req, res, next) => {
	try {
		res.render('login');
	} catch(err) {
		next(err);
	}
});

app.post('/login', passport.authenticate('local', {
	successRedirect: '/profile',
	failureRedirect: '/login'
}));

app.get('/profile', isAuthenticated, (req, res, next) => {
	try {
		res.render('profile', {
			user: req.user
		});
	} catch(err) {
		next(err);
	}
});

app.get('/admin', isAuthenticated, isAdmin, (req, res, next) => {
	try {
		res.render('admin', {
			user: req.user
		});
	} catch(err) {
		next(err);
	}
});

app.get('/logout', async (req, res, next) => {
	try {
		req.logout((err) => {
			if(err) { 
				return res.send(`Log-Out request failed ${err.message}`);
			}
			res.status(200).send('Successfully Logged-Out, <a href="/login"> Login </a>')
		});
	} catch(err) {
		next(err);
	}
});

app.use((req, res, next) => {
	try {
		res.status(404).send('Page Not Found');
	} catch(err) {
		next(err);
	}
});

app.use((err, req, res, next) => {
	if(process.env.NODE_ENV !== 'development') {
		console.log('Error Message: ', err.message);
		console.log('Error Stack: ', err.stack);
		return res.status(500).send('Internal Server Error');
	}
	res.json({ error: err.message });
});

app.listen(port, () => {
	console.log(`Server listening on port ${port}...`);
});
