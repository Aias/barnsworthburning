import type { IExtract } from '$types/Airtable';

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
