<script lang="ts">
	import type { IExtract } from '$types/Airtable';
	import { getArticle } from '$helpers/grammar';

	interface ExtractSEOProps {
		extract: IExtract;
	}
	let { extract }: ExtractSEOProps = $props();

	let title = $derived(extract.title || 'Extract');

	let description = $derived.by(() => {
		const type = extract.format || 'extract';
		const creators =
			(extract.creators || extract.parentCreators)?.map((c) => c.name).join(', ') ||
			'Unknown';
		const parent = extract.parent?.name || '';
		return `${getArticle(type)} ${type.toLowerCase()} by ${creators}${parent ? ` from ${parent}` : ''}.`;
	});

	let modified = $derived.by(() => {
		const lastUpdated = new Date(extract.lastUpdated);
		const publishedOn = new Date(extract.extractedOn);
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
	{#each extract.creators || [] as creator}
		<meta name="author" content={creator.name} />
		<meta property="og:article:author" content={creator.name} />
	{/each}
	<meta
		property="og:article:published_time"
		content={new Date(extract.extractedOn).toISOString()}
	/>
	<meta property="og:article:modified_time" content={modified} />
	{#each extract.images || [] as image}
		<meta property="og:image" content={image.url} />
	{/each}
</svelte:head>
