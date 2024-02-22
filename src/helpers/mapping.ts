import type { IBaseExtract, IExtract } from '$types/Airtable';
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

	const mappedChildren = zip({
		id: children,
		name: childTitles
	});
	const mappedConnections = zip({
		id: connections,
		name: connectionTitles
	});
	const mappedCreators = zip({
		id: creators,
		name: creatorNames
	});
	const mappedParent = zip({
		id: parent,
		name: parentTitle
	});
	const mappedParentCreators = zip({
		id: parentCreatorIds,
		name: parentCreatorNames
	});
	const mappedSpaces = zip({
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
