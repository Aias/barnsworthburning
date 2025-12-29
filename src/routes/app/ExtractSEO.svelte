<script lang="ts">
	import type { IExtract } from '$types/Airtable';
	import { getArticle, combineAsList } from '$helpers/grammar';

	interface ExtractSEOProps {
		extract: IExtract;
	}
	let { extract }: ExtractSEOProps = $props();

	const safeDate = (dateStr: string): Date => {
		const date = new Date(dateStr);
		return isNaN(date.getTime()) ? new Date() : date;
	};

	let title = $derived(extract.title || 'Extract');
	let creators = $derived(extract.creators || extract.parentCreators || []);

	let description = $derived.by(() => {
		const type = extract.format || 'extract';
		const creatorNames = combineAsList(creators.map((c) => c.name));
		if (!creatorNames) {
			return `${getArticle(type)} ${type.toLowerCase()}.`;
		}
		const parent = extract.parent?.name || '';
		return `${getArticle(type)} ${type.toLowerCase()} by ${creatorNames}${parent ? ` from ${parent}` : ''}.`;
	});

	let published = $derived(safeDate(extract.extractedOn).toISOString());

	let modified = $derived.by(() => {
		const lastUpdated = safeDate(extract.lastUpdated);
		const publishedOn = safeDate(extract.extractedOn);
		return new Date(Math.max(lastUpdated.getTime(), publishedOn.getTime())).toISOString();
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta property="og:title" content={title} />
	<meta name="description" content={description} />
	<meta property="og:description" content={description} />
	<meta property="og:site_name" content="barnsworthburning" />
	<meta property="og:url" content={`https://barnsworthburning.net/extracts/${extract.id}`} />
	<meta property="og:type" content="article" />
	{#each extract.creators || extract.parentCreators || [] as creator (creator.id)}
		<meta name="author" content={creator.name} />
		<meta property="article:author" content={creator.name} />
	{/each}
	<meta property="article:published_time" content={published} />
	<meta property="article:modified_time" content={modified} />
	{#each extract.images || [] as image (image.id)}
		<meta property="og:image" content={image.url} />
	{/each}
</svelte:head>
