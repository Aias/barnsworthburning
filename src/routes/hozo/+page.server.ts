import { db } from '$lib/server/db';
import { links, records } from '@aias/hozo';
import { count, sql } from 'drizzle-orm';

const where = {
	isPrivate: false,
	isCurated: true,
	title: { isNotNull: true }
} as const;

const extras = {
	incomingLinkCount: (t: typeof records) =>
		sql<number>`(select ${count()} from ${links} where ${links.targetId} = ${t.id})`
};

export async function load() {
	const [entities, concepts] = await Promise.all([
		db.query.records.findMany({
			where: { ...where, type: 'entity' },
			extras,
			orderBy: { recordUpdatedAt: 'desc' },
			limit: 100
		}),
		db.query.records.findMany({
			where: { ...where, type: 'concept' },
			extras,
			orderBy: { recordUpdatedAt: 'desc' },
			limit: 100
		})
	]);

	return { entities, concepts };
}
