const getLastName = (fullName) => {
	// Split the full name into an array of individual names
	const names = fullName.split(' ');

	// Initialize the last name variable
	let lastName = '';

	// Iterate through the names array
	for (let i = names.length - 1; i >= 0; i--) {
		const part = names[i];
		lastName = `${part} ${lastName}`;

		// Check if the name is a title.
		// Single-letter last names are not titles.
		if (part.endsWith('.') && part.length > 1) {
			// Continue
		} else {
			break;
		}
	}

	return lastName.trim();
};

const lastFirst = (fullName) => {
	const lastName = getLastName(fullName);

	if (lastName === fullName) {
		// e.g., single-word names like Homer or Virgil
		return fullName;
	}

	const lastLoc = fullName.indexOf(lastName);
	const firstPart = fullName.substring(0, lastLoc).trim();

	return `${lastName}, ${firstPart}`;
};

export { getLastName, lastFirst };
