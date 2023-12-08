import zip from '$helpers/zip';

export const mapSpace = (space = {}) => {
	const { extractIds, extractTitles, ...rest } = space;

	const extracts = extractIds ? zip(['id', 'name'], extractIds, extractTitles) : null;

	return {
		...rest,
		extracts
	};
};
