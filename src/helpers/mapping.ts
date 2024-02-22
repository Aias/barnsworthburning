import zip from './zip';
import type { IBaseExtract, IExtract, ILinkedRecord } from '$types/Airtable';

type LinkField = ILinkedRecord[] | undefined;

export const mapExtractRecord = (record: IBaseExtract): IExtract => {
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

	const mappedChildren = zip(['id', 'name'], children, childTitles) as LinkField;
	const mappedConnections = zip(['id', 'name'], connections, connectionTitles) as LinkField;
	const mappedCreators = zip(['id', 'name'], creators, creatorNames) as LinkField;
	const mappedParent = zip(['id', 'name'], parent, parentTitle) as LinkField;
	const mappedParentCreators = zip(
		['id', 'name'],
		parentCreatorIds,
		parentCreatorNames
	) as LinkField;
	const mappedSpaces = zip(['id', 'name'], spaces, spaceTopics) as LinkField;

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
		source,
		lastUpdated: new Date(lastUpdated),
		extractedOn: new Date(extractedOn),
		_original: record
	};
};
