const mongoose = require('mongoose');
const { isEmail } = require('validator');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
	console.log('Database Connected');
})
.catch((err) => {
	console.log('Failed to connect to Database: ', err.message);
	process.exit(1);
});

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: [ true, 'Name field is required' ]
	},
	email: {
		type: String,
		required: [ true, 'Email field id required' ],
		unique: true,
		index: true,
		lowercase: true,
		trim: true,
		validate: [ isEmail, 'Invalid email address' ]
	},
	password: {
		type: String,
		required: [ true, 'Password field is required' ],
		minlength: [ 6, 'Minimum password should be 6 characters long' ]
	},
	role: {
		type: String,
		required: [ true, 'Role field is required' ],
		lowercase: true
	}
});

const User = mongoose.model('user', userSchema);

module.exports = { User };
