import type { IExtract } from '$types/Airtable';
import cache from './cache.svelte';

type ExtractHierarchy = {
	selected: IExtract;
	parents?: IExtract[];
	children?: IExtract[];
	connections?: IExtract[];
};

export function makeHierarchy(extractId: string) {
	const hierarchy: ExtractHierarchy | undefined = $derived.by(() => {
		const currentExtract = cache.extractsById.get(extractId);
		if (!currentExtract) return undefined;

		const getParents = (extract: IExtract): IExtract[] => {
			if (!extract.parent) return [];

			const parent = cache.extractsById.get(extract.parent.id);
			if (!parent) return [];

			if (parent.id === currentExtract.id) return [parent];

			return [...getParents(parent), parent];
		};

		const parents = getParents(currentExtract);

		const children = currentExtract.children
			?.map((child) => {
				const childExtract = cache.extractsById.get(child.id);
				if (!childExtract) return undefined;

				return childExtract;
			})
			.filter(Boolean) as IExtract[];

		const connections = currentExtract.connections
			?.map((connection) => {
				const connectionExtract = cache.extractsById.get(connection.id);
				if (!connectionExtract) return undefined;

				return connectionExtract;
			})
			.filter(Boolean) as IExtract[];

		return {
			selected: currentExtract,
			parents: parents.length ? parents : undefined,
			children,
			connections
		};
	});

	return {
		get full() {
			return hierarchy;
		}
	};
}
