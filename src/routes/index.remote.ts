import { query } from '$app/server';
import { db } from '$lib/server/db';
import { links, predicates, records } from '@aias/hozo';
import { eq, and, desc, count } from 'drizzle-orm';

export const getIndex = query(async () => {
	const [spaces, creators] = await Promise.all([
		db
			.select({
				id: records.id,
				title: records.title,
				linkCount: count(predicates.id)
			})
			.from(records)
			.leftJoin(links, eq(links.targetId, records.id))
			.leftJoin(
				predicates,
				and(eq(links.predicateId, predicates.id), eq(predicates.type, 'description'))
			)
			.where(eq(records.type, 'concept'))
			.groupBy(records.id)
			.orderBy(desc(count(predicates.id)), desc(records.recordUpdatedAt))
			.limit(100),
		db
			.select({
				id: records.id,
				title: records.title,
				linkCount: count(predicates.id)
			})
			.from(records)
			.leftJoin(links, eq(links.targetId, records.id))
			.leftJoin(
				predicates,
				and(eq(links.predicateId, predicates.id), eq(predicates.type, 'creation'))
			)
			.where(eq(records.type, 'entity'))
			.groupBy(records.id)
			.orderBy(desc(count(predicates.id)), desc(records.recordUpdatedAt))
			.limit(100)
	]);
	return {
		creators,
		spaces
	};
});
