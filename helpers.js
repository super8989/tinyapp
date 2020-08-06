// Check if submitted email is in the user database
const checkEmail = (userDB, email) => {
	for (user in userDB) {
		if (userDB[user].email === email) {
			return userDB[user];
		}
	}
	return false;
};

module.exports = { checkEmail };
