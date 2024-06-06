import { type EntityType } from '$helpers/params';

type Segment = {
	entityType: EntityType;
	id: string;
	content: string;
};

export function createTrailState() {
	let trail = $state<Segment[]>([]);

	return {
		get trail() {
			return trail;
		},
		addSegment: (value: Segment) => {
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
