import zip from './zip';
import type { RawExtract, Extract } from '../types/Extract';
import type { LinkedRecord } from '$types/LinkedRecord';

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

	const mappedChildren = zip(['id', 'name'], children, childTitles) as LinkedRecord[] | undefined;
	const mappedConnections = zip(['id', 'name'], connections, connectionTitles) as
		| LinkedRecord[]
		| undefined;
	const mappedCreators = zip(['id', 'name'], creators, creatorNames) as
		| LinkedRecord[]
		| undefined;
	const mappedParent = zip(['id', 'name'], parent, parentTitle) as LinkedRecord[] | undefined;
	const mappedParentCreators = zip(['id', 'name'], parentCreatorIds, parentCreatorNames) as
		| LinkedRecord[]
		| undefined;
	const mappedSpaces = zip(['id', 'name'], spaces, spaceTopics) as LinkedRecord[] | undefined;

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
