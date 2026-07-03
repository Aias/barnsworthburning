<script lang="ts">
	import { getArticle, combineAsList } from '$helpers/grammar';
	import { displayTitle, formatLabel, recordPath, type RecordPage } from '$lib/records';

	interface RecordSEOProps {
		page: RecordPage;
	}
	let { page }: RecordSEOProps = $props();

	let { record, children, associated } = $derived(page);

	let title = $derived(displayTitle(record));
	let creators = $derived(
		record.creators.length > 0 ? record.creators : (record.parent?.creators ?? [])
	);
	let format = $derived(formatLabel(record.format));

	let description = $derived.by(() => {
		if (record.type === 'entity') return `Curated works by ${title}.`;
		if (record.type === 'concept') return `Curated records about ${title}.`;
		const names = combineAsList(creators.map((creator) => displayTitle(creator)));
		const parent = record.parent?.title ?? '';
		if (format) {
			return `${getArticle(format)} ${format.toLowerCase()}${names ? ` by ${names}` : ''}${parent ? ` from ${parent}` : ''}.`;
		}
		if (names) {
			return `By ${names}${parent ? `, from ${parent}` : ''}.`;
		}
		return record.summary || 'A commonplace book.';
	});

	let published = $derived((record.contentCreatedAt ?? record.recordCreatedAt).toISOString());
	let modified = $derived(
		new Date(
			Math.max(
				record.recordUpdatedAt.getTime(),
				(record.contentUpdatedAt ?? record.recordUpdatedAt).getTime()
			)
		).toISOString()
	);

	let ogImage = $derived.by(() => {
		const firstImage = [record, ...children, ...associated]
			.flatMap((card) => card.media)
			.find((item) => item.type === 'image');
		return firstImage?.url ?? record.avatarUrl;
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta property="og:title" content={title} />
	<meta name="description" content={description} />
	<meta property="og:description" content={description} />
	<meta property="og:site_name" content="barnsworthburning" />
	<meta property="og:url" content={`https://barnsworthburning.net${recordPath(record)}`} />
	<meta property="og:type" content="article" />
	{#each creators as creator (creator.id)}
		<meta name="author" content={displayTitle(creator)} />
		<meta property="og:article:author" content={displayTitle(creator)} />
	{/each}
	<meta property="og:article:published_time" content={published} />
	<meta property="og:article:modified_time" content={modified} />
	{#if ogImage}
		<meta property="og:image" content={ogImage} />
	{/if}
</svelte:head>
