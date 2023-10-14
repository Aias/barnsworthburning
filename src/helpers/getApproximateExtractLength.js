import get from './get';

const fields = [
	{ field: 'title', weight: 4 },
	{ field: 'extract_text', weight: 1 },
	{ field: 'image_caption', weight: 0.75 },
	{ field: 'notes', weight: 0.75 }
];

const getApproximateExtractLength = (e) => {
	let hasImage = typeof e['extract_image'] === 'object'; // TODO: Update to handle multiple images, and use width/height fields to make more accurate predictions.
	let score = fields.reduce((prev, cur) => {
		let field = get(e, cur.field, '');
		let numExtraLines = field.split(/\r\n|\r|\n/).length - 1;

		return prev + numExtraLines * 50 + field.length;
	}, 0);

	if (hasImage) score += 500;

	return score;
};

export default getApproximateExtractLength;
