import { error } from '@sveltejs/kit';
import { airtableFetch } from '$lib/server/requests';

export async function load({ params }) {
	return {
		extract: []
	};
}
