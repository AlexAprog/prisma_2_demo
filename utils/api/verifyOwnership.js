export const verifyOwnership = (item, user) => {
	const { author } = item;
	console.log(author.auth0, user.auth0);
	if (author.auth0 !== user.auth0) {
		throw new Error('Access denied, user does not own this item');
	}
};
