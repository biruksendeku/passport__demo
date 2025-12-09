const bcrypt = require('bcryptjs');

function hashPassword(password) {
	//const salt = bcrypt.genSalt();
	return bcrypt.hash(password, 10);
};

function comparePassword(raw, hash) {
	return bcrypt.compare(raw, hash);
};

module.exports = {
	hashPassword,
	comparePassword
};
