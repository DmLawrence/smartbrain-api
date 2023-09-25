const handleSignin = (db, bcrypt, validator) => (req, res) => {
	// Extract user input from the request body
	const { email, password } = req.body;

	// Check if email or password is missing
	if (!email || !password) {
		return res.status(400).json('Incorrect form submission');
	}

	// Validate the email address format
	if (!validator.isEmail(email)) {
		return res.status(400).json({ error: 'Invalid email address' });
	}

	// Query the database to retrieve the user's email and password hash
	db.select('email', 'hash')
		.from('login')
		.where('email', '=', email)
		.then(data => {
			// Check if a matching user was found in the database
		    if (data.length === 0) {
		      return res.status(400).json({ error: 'Wrong credentials' });
		    }

			// Compare the provided password with the stored hash
			const isValid = bcrypt.compareSync(password, data[0].hash);

			// If the password is valid, retrieve the user's data
			if (isValid) {
				return db
					.select('*')
					.from('users')
					.where('email', '=', email)
					.then( users => {
						// Respond with the user's data
						res.json(users[0])
					})
					.catch(err => res.status(400).json({ error: 'Unable to get user' }));
			} else {
				//Invalid password
				res.status(400).json({ error: 'Wrong credentials'})
			}
		})
		.catch(err => res.status(400).json({ error: 'Wrong credentials'}));
}

// Export the signin handler function
module.exports = {
	handleSignin
};