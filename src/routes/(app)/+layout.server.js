import { error } from '@sveltejs/kit';
import { airtableFetch } from '$lib/server/requests';

const MAX_RECORDS = 200;

export async function load() {
	return { index: [] };
}
