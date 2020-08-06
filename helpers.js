// Check if submitted email is in the user database
const checkEmail = (userDB, email) => {
	for (user in userDB) {
		if (userDB[user].email === email) {
			return userDB[user];
		}
	}
	return false;
};

// Filters URLs created by the current user
const urlsForUser = (urlDB, id) => {
	const filteredObj = {};

	for (item in urlDB) {
		if (urlDB[item].userID === id) {
			filteredObj[item] = urlDB[item];
		}
	}
	return filteredObj;
};

module.exports = { checkEmail, urlsForUser };
