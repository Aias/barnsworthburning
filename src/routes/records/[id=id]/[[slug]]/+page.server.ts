import { getCacheHeaders } from '#helpers/cache.js';
import { recordPath } from '#lib/records.js';
import { getRecordPage } from '#lib/server/records.js';
import { error, redirect } from '@sveltejs/kit';

export async function load({ params, setHeaders, url }) {
	const recordPage = await getRecordPage(params.id);
	if (!recordPage) error(404, 'Not found.');

	const canonical = recordPath(recordPage.record);
	const requested = params.slug ? `/records/${params.id}/${params.slug}` : `/records/${params.id}`;
	if (requested !== canonical) redirect(301, canonical + url.search);

	setHeaders(getCacheHeaders('entity'));
	return recordPage;
}
