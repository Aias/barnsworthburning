import type { IExtract } from '$types/Airtable';

export const findFirstImageUrl = (extracts?: IExtract[]): string | null => {
	if (extracts && extracts.length > 0) {
		for (const extract of extracts) {
			if (extract.images && extract.images.length > 0) {
				return extract.images[0].url;
			}
		}
	}
	return null;
};
