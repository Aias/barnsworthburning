import type { RecordType } from '@aias/hozo';
import { type Palette, paletteOptions } from '$types/Theme';
import { DEFAULT_PALETTE } from '$lib/theme/config';
import settings from './settings.svelte';

export type TrailSegment = {
	entityId: number;
	color: Palette;
	addedOn: Date;
};

const rotatePalette = (start: Palette, steps: number = 1) => {
	const currentIndex = paletteOptions.indexOf(start);
	const newIndex = (currentIndex + steps) % paletteOptions.length;
	return paletteOptions[newIndex];
};

export function createTrailState() {
	let trail = $state<TrailSegment[]>([]);
	let selectedSegment = $state<TrailSegment>();
	// Record links carry the target's type through navigation, since the
	// unified /records/{id} URL alone can't tell an artifact from a concept.
	let pendingRecordType: RecordType | undefined;

	return {
		get segments() {
			return trail;
		},
		get selected() {
			return selectedSegment;
		},
		get length() {
			return trail.length;
		},
		addSegment: (entityId: number) => {
			const lastSegment = trail[trail.length - 1];
			const nextColor = lastSegment
				? rotatePalette(lastSegment.color)
				: (settings.palette ?? DEFAULT_PALETTE);
			trail = [...trail, { entityId, color: nextColor, addedOn: new Date() }];
		},
		removeSegment: (id: number) => {
			trail = trail.filter((segment) => segment.entityId !== id);
		},
		removeAfterSegment: (id: number) => {
			const index = trail.findIndex((segment) => segment.entityId === id);
			if (index >= 0) {
				trail = trail.slice(0, index + 1);
			}
		},
		removeExceptSegment: (id: number) => {
			const index = trail.findIndex((segment) => segment.entityId === id);
			if (index >= 0) {
				trail = trail.slice(index, index + 1);
			}
		},
		clearTrail: () => {
			trail = [];
		},
		selectSegment: (id?: number) => {
			selectedSegment = trail.find((segment) => segment.entityId === id);
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
