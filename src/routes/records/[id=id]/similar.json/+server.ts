import { getCacheHeaders } from '$helpers/cache';
import { getSimilarRecords } from '$lib/server/records';
import { stringify } from 'devalue';

export async function GET({ params }) {
	const records = await getSimilarRecords(Number(params.id));

	return new Response(stringify(records), {
		headers: {
			'Content-Type': 'application/json',
			...getCacheHeaders('entity')
		}
	});
}
