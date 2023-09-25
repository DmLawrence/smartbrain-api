const handleRegister = (db, bcrypt, validator) => (req,res) => {
	// Extract user input from the request body
	const { email, name, password } = req.body;

	// Check if any of the required fields are missing
	if (!email || !name || !password) {
		return res.status(400).json({ error: 'Incorrect form submission' });
	}

	// Validate the email address format
	if (!validator.isEmail(email)) {
		return res.status(400).json({ error: 'Invalid email address' });
	}

	// Validate the minimum password length
	if (!validator.isLength(password, { min:8 })) {
		return res.status(400).json({ error: 'Password is not long enough' });
	}

	// Sanitize user inputs (remove leading/trailing white spaces from name, normalize email)
	const sanitizedName = validator.trim(name);
	const sanitizedEmail = validator.normalizeEmail(email);

	// Set the number of salt rounds for bcrypt
	const saltRounds = 12;

	// Hash the user's password using bcrypt
	bcrypt.hash(password, saltRounds, function(err, hash) {
		// Start a database transaction
    	db.transaction(trx => {
    		return trx('login')
			 	.returning('email')
			 	.insert({
				hash: hash,
				email: sanitizedEmail
			})
			.then(loginEmail => {
				return trx('users')
					.returning('*')
					.insert({
						name: sanitizedName,
						email: loginEmail[0].email,
						joined: new Date()
					})
					.then(user => {
						// Respond with the newly registered user
						res.json(user[0]);
					})
			})
			.then(trx.commit) // Commit the transaction if all queries succeed
			.catch(trx.rollback); // Rollback the transaction if any query fails
		})	
		.catch(err => res.status(400).json({ error: 'Unable to register due to error in transaction' }))
	});
}

// Export the registration handler function
module.exports = {
	handleRegister
};