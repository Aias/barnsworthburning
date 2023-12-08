export const mapCreator = (creator = {}) => {
	const { extractIds, extractTitles, spaceIds, spaceTopics, ...rest } = creator;

	const extracts = extractIds ? zip(['id', 'name'], extractIds, extractTitles) : null;
	const spaces = spaceIds ? zip(['id', 'name'], spaceIds.filter(exists), spaceTopics.filter(exists)) : null;

	return {
		...rest,
		extracts,
		spaces
	};
};
