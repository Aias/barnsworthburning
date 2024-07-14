import { type EntityType } from '$helpers/params';
import { type Palette, paletteOptions } from '$types/Theme';
import settings from './settings.svelte';

export type TrailSegment = {
	entityType: EntityType;
	entityId: string;
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
		addSegment: (entityType: EntityType, entityId: string) => {
			const lastSegment = trail[trail.length - 1];
			const nextColor = lastSegment ? rotatePalette(lastSegment.color) : settings.palette;
			trail = [...trail, { entityType, entityId, color: nextColor, addedOn: new Date() }];
		},
		removeSegment: (id: string) => {
			trail = trail.filter((segment) => segment.entityId !== id);
		},
		removeAfterSegment: (id: string) => {
			const index = trail.findIndex((segment) => segment.entityId === id);
			if (index >= 0) {
				trail = trail.slice(0, index + 1);
			}
		},
		removeExceptSegment: (id: string) => {
			const index = trail.findIndex((segment) => segment.entityId === id);
			if (index >= 0) {
				trail = trail.slice(index, index + 1);
			}
		},
		clearTrail: () => {
			trail = [];
		},
		selectSegment: (id?: string) => {
			selectedSegment = trail.find((segment) => segment.entityId === id);
		}
	};
}

export default createTrailState();
