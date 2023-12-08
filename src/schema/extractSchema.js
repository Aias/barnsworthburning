import zip from '$helpers/zip';

export const mapExtract = (extract = {}) => {
	const {
		creatorIds,
		creatorNames,
		parentId: parentIds,
		parentTitle: parentTitles,
		parentCreatorIds,
		parentCreatorNames,
		spaceIds,
		spaceTopics,
		childIds,
		childTitles,
		connectionIds,
		connectionTitles,
		...rest
	} = extract;

	const creators = zip(['id', 'name'], creatorIds, creatorNames);
	const parents = zip(['id', 'name'], parentIds, parentTitles);
	const parentCreators = zip(['id', 'name'], parentCreatorIds, parentCreatorNames);
	const children = zip(['id', 'name'], childIds, childTitles);
	const connections = zip(['id', 'name'], connectionIds, connectionTitles);
	const spaces = zip(['id', 'name'], spaceIds, spaceTopics);

	return {
		...rest,
		creators,
		parent: parents?.[0],
		parentCreators,
		children,
		connections,
		spaces
	};
};
