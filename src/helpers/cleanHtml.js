const cleanHtml = (html = '') => {
	let cleaned = html;

	cleaned = cleaned.replace(/<\!--.*?-->/g, ''); // Remove HTML comments.
	cleaned = cleaned.replace(/[\x9d]/g, ''); // I don't even know what this character is but it's appearing somehow.

	return cleaned;
};

export default cleanHtml;
