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

	return {
		get segments() {
			return trail;
		},
		get length() {
			return trail.length;
		},
		addSegment: (entityType: EntityType, entityId: string) => {
			const lastSegment = trail[trail.length - 1];
			const lastColor = lastSegment ? lastSegment.color : settings.palette;
			const nextColor = rotatePalette(lastColor);
			trail = [...trail, { entityType, entityId, color: nextColor, addedOn: new Date() }];
		},
		removeSegment: (id: string) => {
			trail = trail.filter((segment) => segment.entityId !== id);
		},
		clearTrail: () => {
			trail = [];
		}
	};
}

export default createTrailState();
