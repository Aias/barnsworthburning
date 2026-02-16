import type { IExtract } from '$types/Airtable';

export const findFirstImageUrl = (extracts?: IExtract[]): string | null => {
	if (!extracts) return null;
	for (const extract of extracts) {
		if (extract.images?.length) return extract.images[0].url;
	}
	return null;
};
