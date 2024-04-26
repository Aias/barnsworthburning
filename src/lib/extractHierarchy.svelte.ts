import type { IExtract } from '$types/Airtable';
import cache from './cache.svelte';

type ExtractHierarchy = {
	tree: {
		parent: IExtract | undefined;
		extract: IExtract;
		children: IExtract[];
	};
	related: IExtract[];
};

export function extractHierarchy(extractId: string): ExtractHierarchy | undefined {
	const extract = cache.extractsById.get(extractId);
	if (!extract) {
		return undefined;
	}

	return {
		tree: {
			parent: undefined,
			extract: extract,
			children: []
		},
		related: []
	};
}
