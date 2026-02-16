import type {
	IBaseExtract,
	IExtract,
	ILinkedRecord,
	IBaseCreator,
	ICreator,
	IBaseSpace,
	ISpace
} from '$types/Airtable';

function zipRecords(ids: string[], names: string[]): ILinkedRecord[] | undefined {
	if (ids.length === 0 || ids.length !== names.length) return undefined;
	return ids.map((id, i) => ({ id, name: names[i] }));
}

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
		format,
		publishedOn
	} = record;

	const mappedChildren = zipRecords(children, childTitles);
	const mappedConnections = zipRecords(connections, connectionTitles);
	const mappedCreators = zipRecords(creators, creatorNames);
	const mappedParent = zipRecords(parent, parentTitle);
	const mappedParentCreators = zipRecords(parentCreatorIds, parentCreatorNames);
	const mappedSpaces = zipRecords(spaces, spaceTopics);

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
		lastUpdated,
		extractedOn,
		publishedOn
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
		createdTime,
		lastUpdated
	} = record;

	const mappedExtracts = zipRecords(extracts, extractTitles);

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
		totalStars,
		createdTime,
		lastUpdated
	};
};

export const mapSpaceRecord = (record: IBaseSpace): ISpace => {
	const {
		id,
		topic,
		title,
		icon,
		description,
		extracts = [],
		extractTitles = [],
		numExtracts,
		totalStars,
		createdTime,
		lastUpdated
	} = record;

	const mappedExtracts = zipRecords(extracts, extractTitles);

	return {
		id,
		topic,
		title,
		icon,
		description,
		extracts: mappedExtracts,
		numExtracts,
		totalStars,
		createdTime,
		lastUpdated
	};
};

type ExtractHierarchy = {
	selected: IExtract;
	parents?: IExtract[];
	children?: IExtract[];
	connections?: IExtract[];
};

export function makeHierarchy(extracts: IExtract[], selectedExtractId: string): ExtractHierarchy {
	const extractsById = new Map(extracts.map((extract) => [extract.id, extract]));
	const selectedExtract = extractsById.get(selectedExtractId) ?? extracts[0];

	const getParents = (extract: IExtract): IExtract[] => {
		if (!extract.parent) return [];

		const parent = extractsById.get(extract.parent.id);
		if (!parent) return [];

		if (parent.id === selectedExtract.id) return [parent];

		return [...getParents(parent), parent];
	};

	const parents = getParents(selectedExtract);

	const children = selectedExtract.children
		?.map((child) => extractsById.get(child.id))
		.filter((child): child is IExtract => !!child);

	const connections = selectedExtract.connections
		?.map((connection) => extractsById.get(connection.id))
		.filter((connection): connection is IExtract => !!connection);

	return {
		selected: selectedExtract,
		parents: parents.length ? parents : undefined,
		children: children?.length ? children : undefined,
		connections: connections?.length ? connections : undefined
	};
}
