const isAuthenticated = async (req, res, next) => {
	try {
		if(req.isAuthenticated()) {
			return next();
		}
		res.status(400).send('Not Authenticated');
	} catch(err) {
		next(err);
	}
};

const isAdmin = async (req, res, next) => {
	try {
		if(req.user.role === 'admin') {
			return next();
		}
		res.status(400).send('Insufficient Permission, Admin Access Required');
	} catch(err) {
		next(err);
	}
};

module.exports =  { isAuthenticated, isAdmin };
