import { json, text } from '@sveltejs/kit';
import { createApi } from '$lib/api';
import { getContentType } from '$helpers/content';
import { capitalize } from '$helpers/grammar';

export async function GET({ fetch, params, url }) {
	const { entityType, format } = params;
	const api = createApi(fetch);

	if (!['md', 'txt', 'json'].includes(format)) {
		return new Response('Unsupported format', { status: 400 });
	}

	switch (entityType) {
		case 'creators':
			const creators = await api.creators.list();
			if (format === 'json') {
				return json(creators);
			}
			let creatorsContent = `# Creators\n\n`;
			creators.forEach((creator) => {
				creatorsContent += `## ${creator.name}\n`;
				creatorsContent += `https://barnsworthburning.net/creators/${creator.id}.${format}\n`;
				creator.site ? (creatorsContent += `- Website: ${creator.site}\n`) : '';
				creator.lastUpdated
					? (creatorsContent += `- Last Updated: ${new Date(creator.lastUpdated).toLocaleDateString()}\n`)
					: '';
				creatorsContent += `- Extracts: ${creator.numExtracts}\n\n`;
			});
			return text(creatorsContent, {
				headers: {
					'Content-Type': getContentType(url)
				}
			});

		case 'spaces':
			const spaces = await api.spaces.list();
			if (format === 'json') {
				return json(spaces);
			}
			let spacesContent = `# Spaces\n\n`;
			spaces.forEach((space) => {
				spacesContent +=
					`## ${space.title ?? capitalize(space.topic)}` +
					(space.icon ? ` ${space.icon}` : '') +
					`\n`;
				spacesContent += `https://barnsworthburning.net/spaces/${space.id}.${format}\n`;
				space.description ? (spacesContent += `${space.description}\n`) : '';
				space.lastUpdated
					? (spacesContent += `- Last Updated: ${new Date(space.lastUpdated).toLocaleDateString()}\n`)
					: '';
				spacesContent += `- Extracts: ${space.numExtracts}\n\n`;
			});
			return text(spacesContent, {
				headers: {
					'Content-Type': getContentType(url)
				}
			});

		case 'extracts':
			const extracts = await api.extracts.list();
			if (format === 'json') {
				return json(extracts);
			}
			let extractsContent = `# Extracts\n\n`;
			extracts.forEach((extract) => {
				extractsContent += `- **${extract.title}**: https://barnsworthburning.net/extracts/${extract.id}.${format}\n`;
			});
			return text(extractsContent, {
				headers: {
					'Content-Type': getContentType(url)
				}
			});

		default:
			return new Response('Invalid entity type', { status: 400 });
	}
}
