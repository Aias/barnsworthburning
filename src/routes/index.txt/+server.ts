import { getCacheHeaders } from '$helpers/cache';
import { getContentType } from '$helpers/content';
import { displayTitle, recordPath, sections } from '$lib/records';
import { getIndexEntries } from '$lib/server/records';
import { text } from '@sveltejs/kit';

export async function GET({ url }) {
	const entries = await getIndexEntries();

	const combinedList = entries
		.map((entry) => ({
			nameWithLink: `[${displayTitle(entry)}](https://barnsworthburning.net${recordPath(entry)})`,
			type: sections[entry.type].singular,
			count: entry.count
		}))
		.sort((a, b) => a.nameWithLink.localeCompare(b.nameWithLink));

	const columnWidths = {
		nameWithLink: Math.max(...combinedList.map((item) => item.nameWithLink.length), 10),
		type: Math.max(...combinedList.map((item) => item.type.length), 4),
		count: Math.max(...combinedList.map((item) => String(item.count).length), 7)
	};

	let rootPageContent = '# barnsworthburning\n\n';
	rootPageContent += 'A commonplace book.\n\n';

	rootPageContent += `| ${'Name/Topic'.padEnd(columnWidths.nameWithLink)} | ${'Type'.padEnd(columnWidths.type)} | ${'Records'.padStart(columnWidths.count)} |\n`;
	rootPageContent += `| ${'-'.repeat(columnWidths.nameWithLink)} | ${'-'.repeat(columnWidths.type)} | ${'-'.repeat(columnWidths.count)} |\n`;

	combinedList.forEach((item) => {
		rootPageContent += `| ${item.nameWithLink.padEnd(columnWidths.nameWithLink)} | ${item.type.padEnd(columnWidths.type)} | ${String(item.count).padStart(columnWidths.count)} |\n`;
	});

	return text(rootPageContent, {
		headers: {
			'Content-Type': getContentType(url),
			...getCacheHeaders('entityList')
		}
	});
}
