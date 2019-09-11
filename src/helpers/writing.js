// Almost entirely adapted from:
// https://github.com/doppelganger9/blog/blob/master/src/routes/index.json.js

import fs from 'fs';
import path from 'path';
import markdown from './markdown';

const WRITING_DIRECTORY = './src/writing';

export function getFiles(subdir = '') {
	let dir = WRITING_DIRECTORY;
	if (subdir) {
		dir = `${dir}/${subdir}`;
	}
	const slugs = fs
		.readdirSync(dir)
		.filter(file => path.extname(file) === '.md')
		.map(file => file.slice(0, -3));

	return (
		slugs
			.map(slug => getFile(slug, subdir))
			// .filter(file => file.meta.published)
			.sort((a, b) => {
				return (a.meta.order || 0) - (b.meta.order || 0);
			})
	);
}

export function getFile(slug = '', subdir = '') {
	let dir = WRITING_DIRECTORY;
	if (subdir) {
		dir = `${dir}/${subdir}`;
	}
	let filePath = `${dir}/${slug}.md`;

	if (!fs.existsSync(filePath)) return null;

	const rawContent = fs.readFileSync(filePath, 'utf-8');

	let html = markdown.render(rawContent);

	return {
		slug,
		html,
		rawContent,
		meta: markdown.meta
	};
}
