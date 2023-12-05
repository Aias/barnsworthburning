import zip from './zip';
import exists from './exists';

const mapCreator = (creator = {}) => {
	const { extractIds, extractTitles, spaceIds, spaceTopics, ...rest } = creator;

	const extracts = extractIds ? zip(['id', 'name'], extractIds, extractTitles) : null;
	const spaces = spaceIds ? zip(['id', 'name'], spaceIds.filter(exists), spaceTopics.filter(exists)) : null;

	return {
		...rest,
		extracts,
		spaces
	};
};

const mapSpace = (space = {}) => {
	const { extractIds, extractTitles, ...rest } = space;

	const extracts = extractIds ? zip(['id', 'name'], extractIds, extractTitles) : null;

	return {
		...rest,
		extracts
	};
};

const mapExtract = (extract = {}) => {
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
	const parentCreators = zip(['id', 'name'], parentCreatorIds, parentCreatorNames);
	const spaces = zip(['id', 'name'], spaceIds, spaceTopics);
	const parents = zip(['id', 'name'], parentIds, parentTitles);
	const children = zip(['id', 'name'], childIds, childTitles);
	const connections = zip(['id', 'name'], connectionIds, connectionTitles);

	return {
		...rest,
		creators: creators,
		parentCreators: parentCreators,
		spaces: spaces,
		parent: parents?.[0],
		children: children,
		connections: connections
	};
};

const mapIndex = (creators = [], spaces = []) => {
	let creatorMap = creators.map(({ name, id, numExtracts, lastUpdated, ...creator }) => ({
		id,
		type: 'creator',
		label: name,
		count: numExtracts,
		time: new Date(lastUpdated)
	}));
	let spacesMap = spaces.map(({ topic, id, numExtracts, lastUpdated, ...space }) => ({
		id,
		type: 'space',
		label: topic,
		count: numExtracts,
		time: new Date(lastUpdated)
	}));

	return creatorMap.concat(spacesMap);
};

export { mapExtract, mapCreator, mapSpace, mapIndex };
