import zip from './zip';
import type { IRawExtract, IExtract } from '../types/Extract';
import type { ILinkedRecord } from '$types/LinkedRecord';

export const mapExtractRecord = (record: IRawExtract): IExtract => {
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

	const mappedChildren = zip(['id', 'name'], children, childTitles) as
		| ILinkedRecord[]
		| undefined;
	const mappedConnections = zip(['id', 'name'], connections, connectionTitles) as
		| ILinkedRecord[]
		| undefined;
	const mappedCreators = zip(['id', 'name'], creators, creatorNames) as
		| ILinkedRecord[]
		| undefined;
	const mappedParent = zip(['id', 'name'], parent, parentTitle) as ILinkedRecord[] | undefined;
	const mappedParentCreators = zip(['id', 'name'], parentCreatorIds, parentCreatorNames) as
		| ILinkedRecord[]
		| undefined;
	const mappedSpaces = zip(['id', 'name'], spaces, spaceTopics) as ILinkedRecord[] | undefined;

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
