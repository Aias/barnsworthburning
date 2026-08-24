import { getRecordPage, getSimilarRecords } from '#lib/server/records.js';
import { query } from '$app/server';
import { error } from '@sveltejs/kit';
import { z } from 'zod';

const recordId = z.int().positive();

export const recordPage = query(recordId, async (id) => {
	const page = await getRecordPage(id);
	if (!page) error(404, 'Not found.');
	return page;
});

export const similarRecords = query(recordId, getSimilarRecords);
