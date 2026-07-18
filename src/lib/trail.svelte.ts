import { type Palette, paletteOptions } from '$types/Theme';
import type { RecordType } from '@aias/hozo';

export const TRAIL_PARAM = 'trail';

export type TrailSegment = {
	entityId: number;
	color: Palette;
};

const rotatePalette = (start: Palette, steps: number = 1) => {
	const currentIndex = paletteOptions.indexOf(start);
	const newIndex = (currentIndex + steps) % paletteOptions.length;
	return paletteOptions[newIndex];
};

export const parseTrail = (url: URL): number[] => {
	const ids = new Set<number>();
	for (const part of url.searchParams.get(TRAIL_PARAM)?.split('-') ?? []) {
		const id = Number(part);
		if (Number.isInteger(id) && id > 0) ids.add(id);
	}
	return [...ids];
};

export const trailHref = (url: URL, ids: number[]): string => {
	const nextUrl = new URL(url);
	if (ids.length > 0) {
		nextUrl.searchParams.set(TRAIL_PARAM, ids.join('-'));
	} else {
		nextUrl.searchParams.delete(TRAIL_PARAM);
	}
	return `${nextUrl.pathname}${nextUrl.search}`;
};

export const trailSegments = (ids: number[], basePalette: Palette): TrailSegment[] =>
	ids.map((entityId, index) => ({ entityId, color: rotatePalette(basePalette, index) }));

export function createTrailState() {
	let selectedId = $state<number>();
	// Record links carry the target's type through navigation, since the
	// unified /records/{id} URL alone can't tell an artifact from a concept.
	let pendingRecordType: RecordType | undefined;

	return {
		get selectedId() {
			return selectedId;
		},
		selectSegment: (id?: number) => {
			selectedId = id;
		},
		setPendingRecordType: (type?: RecordType) => {
			pendingRecordType = type;
		},
		takePendingRecordType: (): RecordType | undefined => {
			const type = pendingRecordType;
			pendingRecordType = undefined;
			return type;
		}
	};
}

export default createTrailState();
