export const slugify = (title: string) => {
	// Trim leading and trailing whitespace
	let slug = title.trim();

	// Convert to lowercase
	slug = slug.toLowerCase();

	// Remove all characters that are not letters, numbers, spaces, or hyphens
	slug = slug.replace(/[^a-z0-9\s-]/g, '');

	// Replace one or more spaces with a single hyphen
	slug = slug.replace(/\s+/g, '-');

	return slug;
};

export default slugify;
