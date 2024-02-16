import zip from './zip';
import type { RawExtract, Extract } from '../types/Extract';

export const mapExtractRecord = (record: RawExtract): Extract => {
	const {
		childTitles = [],
		children = [],
		connectionTitles = [],
		connections = [],
		creatorNames = [],
		creators = [],
		extract,
		extractedOn,
		id,
		imageCaption,
		images,
		isWork,
		lastUpdated,
		michelinStars,
		notes,
		numChildren,
		numFragments,
		parent = [],
		parentCreatorIds = [],
		parentCreatorNames = [],
		parentTitle = [],
		source,
		spaceTopics = [],
		spaces = [],
		title,
		format
	} = record;

	const mappedChildren = zip(['id', 'name'], children, childTitles);
	const mappedConnections = zip(['id', 'name'], connections, connectionTitles);
	const mappedCreators = zip(['id', 'name'], creators, creatorNames);
	const mappedParent = zip(['id', 'name'], parent, parentTitle);
	const mappedParentCreators = zip(['id', 'name'], parentCreatorIds, parentCreatorNames);
	const mappedSpaces = zip(['id', 'name'], spaces, spaceTopics);

	return {
		id,
		title,
		format,
		extract,
		spaces: mappedSpaces,
		connections: mappedConnections,
		creators: mappedCreators,
		children: mappedChildren,
		parent: mappedParent ? mappedParent[0] : undefined,
		parentCreators: mappedParentCreators,
		images,
		imageCaption,
		isWork,
		michelinStars,
		notes,
		numChildren,
		numFragments,
		source,
		lastUpdated: new Date(lastUpdated),
		extractedOn: new Date(extractedOn),
		_original: record
	};
};
