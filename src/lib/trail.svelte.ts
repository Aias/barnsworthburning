import { type EntityType } from '$helpers/params';
import type { Palette } from '$types/Theme';

export type TrailSegment = {
	entityType: EntityType;
	id: string;
	color: Palette;
};

export function createTrailState() {
	let trail = $state<TrailSegment[]>([]);

	return {
		get segments() {
			return trail;
		},
		addSegment: (value: TrailSegment) => {
			trail = [...trail, value];
		},
		removeSegment: (id: string) => {
			trail = trail.filter((segment) => segment.id !== id);
		},
		clearTrail: () => {
			trail = [];
		}
	};
}

export default createTrailState();
