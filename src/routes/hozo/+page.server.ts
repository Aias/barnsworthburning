import { db } from '$lib/server/db';

const where = {
	isPrivate: false,
	isCurated: true,
	title: { isNotNull: true }
} as const;

export async function load() {
	const [entities, concepts] = await Promise.all([
		db.query.records.findMany({
			where: { ...where, type: 'entity' },
			orderBy: { recordUpdatedAt: 'desc' },
			limit: 100
		}),
		db.query.records.findMany({
			where: { ...where, type: 'concept' },
			orderBy: { recordUpdatedAt: 'desc' },
			limit: 100
		})
	]);

	return { entities, concepts };
}
