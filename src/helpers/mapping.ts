import type {
	IBaseExtract,
	IExtract,
	ILinkedRecord,
	IBaseCreator,
	ICreator,
	IBaseSpace,
	ISpace
} from '$types/Airtable';

type Input<Type> = {
	[Key in keyof Type]: Type[Key][];
};

export function zip<Type>(input: Input<Type>): Type[] | undefined {
	const outputArraySize = (Object.values(input)[0] as Array<unknown>).length;

	// Check if any values in input are undefined or have length 0
	const hasUndefinedOrEmptyValues = Object.values(input).some(
		(values) =>
			values !== null && (values === undefined || (values as Array<unknown>).length === 0)
	);

	// Check if any required properties are missing in the input object
	const hasMissingProperties = Object.keys(input).some(
		(key) => input[key as keyof Type].length !== outputArraySize
	);

	if (hasUndefinedOrEmptyValues || hasMissingProperties) {
		return undefined;
	}

	return Array.from({ length: outputArraySize }, (_, idx) =>
		Object.entries(input).reduce((accumulator, [key, values]) => {
			return { ...accumulator, [key]: (values as Array<unknown>)[idx] };
		}, {} as Type)
	);
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
		extractedOn: new Date(extractedOn),
		publishedOn: new Date(publishedOn)
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

	const mappedExtracts = zip<ILinkedRecord>({
		id: extracts,
		name: extractTitles
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
		totalStars,
		createdTime: new Date(createdTime),
		lastUpdated: new Date(lastUpdated)
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

	const mappedExtracts = zip<ILinkedRecord>({
		id: extracts,
		name: extractTitles
	});

	return {
		id,
		topic,
		title,
		icon,
		description,
		extracts: mappedExtracts,
		numExtracts,
		totalStars,
		createdTime: new Date(createdTime),
		lastUpdated: new Date(lastUpdated)
	};
};

type ExtractHierarchy = {
	selected: IExtract;
	parents?: IExtract[];
	children?: IExtract[];
	connections?: IExtract[];
};

export function makeHierarchy(extracts: IExtract[], selectedExtractId: string) {
	const extractsById = new Map(extracts.map((extract) => [extract.id, extract]));
	const selectedExtract = extractsById.get(selectedExtractId);

	if (!selectedExtract) {
		return {
			full: undefined,
			selected: undefined,
			parents: undefined,
			children: undefined,
			connections: undefined
		};
	}

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

	const hierarchy: ExtractHierarchy = {
		selected: selectedExtract,
		parents: parents.length ? parents : undefined,
		children: children?.length ? children : undefined,
		connections: connections?.length ? connections : undefined
	};

	return {
		get full() {
			return hierarchy;
		},
		get selected() {
			return hierarchy.selected;
		},
		get parents() {
			return hierarchy.parents;
		},
		get children() {
			return hierarchy.children;
		},
		get connections() {
			return hierarchy.connections;
		}
	};
}
