import zip from './zip';
import { lastFirst } from './names';
import exists from './exists';

// const EXTRACT_FIELDS = [
// 	'title',
// 	'type',
// 	'source',
// 	'extract',
// 	'creators',
// 	'creatorNames',
// 	'parent',
// 	'parentTitle',
// 	'parentCreators',
// 	'parentCreatorNames',
// 	'children',
// 	'childTitles',
// 	'numChildren',
// 	'spaces',
// 	'spaceTopics',
// 	'connections',
// 	'connectionTitles',
// 	'starred',
// 	'michelinStars',
// 	'images',
// 	'imageCaption',
// 	'notes',
// 	'extractedOn',
// 	'lastUpdated',
// 	'isWork',
// 	'numFragments',
// ]

const mapCreator = (creator = {}) => {
	const { extracts: extractIds, extractTitles, spaceIds, spaceTopics, ...rest } = creator;

	const extracts = zip(['id', 'name'], extractIds, extractTitles);
	const spaces = zip(['id', 'name'], spaceIds.filter(exists), spaceTopics.filter(exists));

	return {
		...rest,
		extracts,
		spaces
	};
};

const mapExtract = (extract = {}) => {
	const {
		creators: creatorIds,
		creatorNames,
		parent: parentIds,
		parentTitle: parentTitles,
		parentCreators: parentCreatorIds,
		parentCreatorNames,
		spaces: spaceIds,
		spaceTopics,
		children: childIds,
		childTitles,
		connections: connectionIds,
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
	let creatorMap = creators.map(({ sortAsIs, name, id, lastUpdated, numExtracts, ...creator }) => ({
		id,
		type: 'creator',
		label: sortAsIs ? name : lastFirst(name),
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

export { mapExtract, mapCreator, mapIndex };
