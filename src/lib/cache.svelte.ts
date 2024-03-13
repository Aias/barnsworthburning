import type { ICreator, IExtract, ISpace } from '$types/Airtable';

// TODO: When Svelte 5 supports reactive Maps, use those instead of objects
export function createCache() {
	const extractsById: Record<string, IExtract> = $state({});
	const creatorsById: Record<string, ICreator> = $state({});
	const spacesById: Record<string, ISpace> = $state({});

	const allExtracts = $derived(Object.values(extractsById));
	const allCreators = $derived(Object.values(creatorsById));
	const allSpaces = $derived(Object.values(spacesById));

	return {
		get extractsById() {
			return extractsById;
		},
		get allExtracts() {
			return allExtracts;
		},
		addExtracts: (extracts: IExtract[]) => {
			extracts.forEach((extract) => {
				extractsById[extract.id] = extract;
			});
		},
		get creatorsById() {
			return creatorsById;
		},
		get allCreators() {
			return allCreators;
		},
		addCreators: (creators: ICreator[]) => {
			creators.forEach((creator) => {
				creatorsById[creator.id] = creator;
			});
		},
		get spacesById() {
			return spacesById;
		},
		get allSpaces() {
			return allSpaces;
		},
		addSpaces: (spaces: ISpace[]) => {
			spaces.forEach((space) => {
				spacesById[space.id] = space;
			});
		}
	};
}

export default createCache();
