import { stringify } from 'devalue';
import { getSimilarRecords } from '$lib/server/records';
import { getCacheHeaders } from '$helpers/cache';

export async function GET({ params }) {
	const records = await getSimilarRecords(Number(params.id));

	return new Response(stringify(records), {
		headers: {
			'Content-Type': 'application/json',
			...getCacheHeaders('entity')
		}
	});
}
