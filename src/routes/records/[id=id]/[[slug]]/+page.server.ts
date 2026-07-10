import { error, redirect } from '@sveltejs/kit';
import { recordPath } from '$lib/records';
import { getRecordPage } from '$lib/server/records';
import { getCacheHeaders } from '$helpers/cache';

export async function load({ params, setHeaders, url }) {
	const recordPage = await getRecordPage(Number(params.id));
	if (!recordPage) error(404, 'Not found.');

	const canonical = recordPath(recordPage.record);
	const requested = params.slug ? `/records/${params.id}/${params.slug}` : `/records/${params.id}`;
	if (requested !== canonical) redirect(301, canonical + url.search);

	setHeaders(getCacheHeaders('entity'));
	return recordPage;
}
