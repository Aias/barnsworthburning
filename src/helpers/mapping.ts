import type {
	IBaseExtract,
	IExtract,
	ILinkedRecord,
	IBaseCreator,
	ICreator
} from '$types/Airtable';
import zip from '$helpers/zip';

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

	const mappedChildren = zip<ILinkedRecord>({
		id: children,
		name: childTitles
	});
	const mappedConnections = zip<ILinkedRecord>({
		id: connections,
		name: connectionTitles
	});
	const mappedCreators = zip<ILinkedRecord>({
		id: creators,
		name: creatorNames
	});
	const mappedParent = zip<ILinkedRecord>({
		id: parent,
		name: parentTitle
	});
	const mappedParentCreators = zip<ILinkedRecord>({
		id: parentCreatorIds,
		name: parentCreatorNames
	});
	const mappedSpaces = zip<ILinkedRecord>({
		id: spaces,
		name: spaceTopics
	});

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
		extractedOn: new Date(extractedOn)
	};
};

export const mapCreatorRecord = (record: IBaseCreator): ICreator => {
	const {
		id,
		name,
		primaryProject,
		type,
		site,
		professions,
		organizations,
		nationality,
		numWorks,
		numFragments,
		numExtracts,
		totalStars,
		extracts = [],
		extractTitles = [],
		spaces = [],
		spaceTopics = [],
		connectedCreators = [],
		connectedCreatorNames = [],
		createdTime,
		lastUpdated
	} = record;

	const mappedExtracts = zip<ILinkedRecord>({
		id: extracts,
		name: extractTitles
	});

	const mappedSpaces = zip<ILinkedRecord>({
		id: spaces,
		name: spaceTopics
	});

	const mappedConnectedCreators = zip<ILinkedRecord>({
		id: connectedCreators,
		name: connectedCreatorNames
	});

	return {
		id,
		name,
		primaryProject,
		type,
		site,
		professions,
		organizations,
		nationality,
		numWorks,
		numFragments,
		numExtracts,
		extracts: mappedExtracts,
		spaces: mappedSpaces,
		totalStars,
		connectedCreators: mappedConnectedCreators,
		createdTime: new Date(createdTime),
		lastUpdated: new Date(lastUpdated)
	};
};
