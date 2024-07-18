// import type { ICreator, IExtract, ISpace } from '$types/Airtable';
// import { SvelteMap as Map } from 'svelte/reactivity';

// export function createCache() {
// 	const extractsById = new Map<string, IExtract>();
// 	const creatorsById = new Map<string, ICreator>();
// 	const spacesById = new Map<string, ISpace>();

// 	return {
// 		get extractsById() {
// 			return extractsById;
// 		},
// 		get allExtracts() {
// 			return [...extractsById.values()];
// 		},
// 		addExtracts: (extracts: IExtract[]) => {
// 			extracts.forEach((extract) => {
// 				extractsById.set(extract.id, extract);
// 			});
// 		},
// 		get creatorsById() {
// 			return creatorsById;
// 		},
// 		get allCreators() {
// 			return [...creatorsById.values()];
// 		},
// 		addCreators: (creators: ICreator[]) => {
// 			creators.forEach((creator) => {
// 				creatorsById.set(creator.id, creator);
// 			});
// 		},
// 		get spacesById() {
// 			return spacesById;
// 		},
// 		get allSpaces() {
// 			return [...spacesById.values()];
// 		},
// 		addSpaces: (spaces: ISpace[]) => {
// 			spaces.forEach((space) => {
// 				spacesById.set(space.id, space);
// 			});
// 		}
// 	};
// }

// export default createCache();
