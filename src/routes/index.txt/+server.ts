import { createApi } from '$lib/api';
import { text } from '@sveltejs/kit';

export async function GET({ fetch }) {
	const api = createApi(fetch);

	const [creators, spaces] = await Promise.all([api.creators.list(), api.spaces.list()]);

	const combinedList = [
		...creators.map((creator) => ({
			nameWithLink: `[${creator.name}](https://barnsworthburning.net/creators/${creator.id})`,
			type: 'Creator',
			numExtracts: creator.numExtracts
		})),
		...spaces.map((space) => ({
			nameWithLink: `[${space.topic || 'Untitled'}](https://barnsworthburning.net/spaces/${space.id})`,
			type: 'Topic',
			numExtracts: space.numExtracts
		}))
	].sort((a, b) => a.nameWithLink.localeCompare(b.nameWithLink));

	const columnWidths = {
		nameWithLink: Math.max(...combinedList.map((item) => item.nameWithLink.length), 10),
		type: Math.max(...combinedList.map((item) => item.type.length), 4),
		numExtracts: Math.max(...combinedList.map((item) => String(item.numExtracts).length), 8)
	};

	let rootPageContent = '# barnsworthburning\n\n';
	rootPageContent += 'A commonplace book.\n\n';

	rootPageContent += `| ${'Name/Topic'.padEnd(columnWidths.nameWithLink)} | ${'Type'.padEnd(columnWidths.type)} | ${'Extracts'.padStart(columnWidths.numExtracts)} |\n`;
	rootPageContent += `| ${'-'.repeat(columnWidths.nameWithLink)} | ${'-'.repeat(columnWidths.type)} | ${'-'.repeat(columnWidths.numExtracts)} |\n`;

	combinedList.forEach((item) => {
		rootPageContent += `| ${item.nameWithLink.padEnd(columnWidths.nameWithLink)} | ${item.type.padEnd(columnWidths.type)} | ${String(item.numExtracts).padStart(columnWidths.numExtracts)} |\n`;
	});

	return text(rootPageContent, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8'
		}
	});
}
