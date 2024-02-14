<script>
	let { extract } = $props();
	import AirtableImage from '$components/AirtableImage.svelte';
	import markdown from '$helpers/markdown';
	import TopicList from './TopicList.svelte';

	let michelinStars = $derived(extract.michelinStars);
	let title = $derived(extract.title);
	let images = $derived(extract.images);
	let notes = $derived(extract.notes);
	let extractText = $derived(extract.extract);
	let spaces = $derived(extract.spaces);

	const previewLength = 280;

	// Function to trim a string to a certain length
	function trimString(string, length) {
		if (!string) return;
		if (string.length > length) {
			return string.substring(0, length) + '...';
		} else {
			return string;
		}
	}

	function makeMarkdown(string) {
		const trimmed = trimString(string, previewLength);
		return markdown.render(trimmed);
	}

	// Create a string of star emojis given a count
	function starRating(count) {
		return '⭐️'.repeat(count);
	}
</script>

<article>
	<h3>
		{#if michelinStars}
			<span>{starRating(michelinStars)}</span>
		{/if}
		<span>{title}</span>
	</h3>
	{#if images}
		{#each images as image}
			<AirtableImage {image} />
		{/each}
	{/if}
	{#if extractText}
		<p>{@html makeMarkdown(extractText)}</p>
	{/if}
	{#if notes}
		<small>{@html makeMarkdown(notes)}</small>
	{/if}
	{#if spaces}
		<TopicList topics={spaces} />
	{/if}
</article>

<style lang="scss">
	article {
		--extract-gap: 1em;
		border: 1px solid var(--divider);
		padding: 1em;
		display: flex;
		flex-direction: column;
		gap: var(--extract-gap);
		word-wrap: break-word;

		p,
		small {
			font-weight: 300;
		}

		small {
			color: var(--secondary);
			border-top: 1px solid var(--divider);
			padding-top: var(--extract-gap);
		}
	}
</style>
