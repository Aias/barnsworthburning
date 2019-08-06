// Almost entirely adapted from:
// https://github.com/doppelganger9/blog/blob/master/src/routes/index.json.js

import fs from 'fs';
import path from 'path';
import markdown from './markdown';

const WRITING_DIRECTORY = './src/writing';
const BLOG_DIRECTORY = WRITING_DIRECTORY + '/blog';

export function getFiles() {
	const slugs = fs
		.readdirSync(WRITING_DIRECTORY)
		.filter(file => path.extname(file) === '.md')
		.map(file => file.slice(0, -3));

	return slugs.map(getFile);
	// .filter(file => file.meta.published)
	// .sort((a, b) => {
	// 	return a.meta.order - b.meta.order;
	// });
}

export function getFile(slug) {
	const filePath = `${WRITING_DIRECTORY}/${slug}.md`;
	if (!fs.existsSync(filePath)) return null;

	const rawContent = fs.readFileSync(filePath, 'utf-8');

	let html = markdown.render(rawContent);

	return {
		slug,
		html,
		rawContent
	};
}
