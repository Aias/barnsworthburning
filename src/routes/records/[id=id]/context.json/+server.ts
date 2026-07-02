import { error } from '@sveltejs/kit';
import { stringify } from 'devalue';
import { getRecordPage } from '$lib/server/records';
import { getCacheHeaders } from '$helpers/cache';

export async function GET({ params }) {
	const recordPage = await getRecordPage(Number(params.id));
	if (!recordPage) error(404, 'Not found.');

	return new Response(stringify(recordPage), {
		headers: {
			'Content-Type': 'application/json',
			...getCacheHeaders('entity')
		}
	});
}
