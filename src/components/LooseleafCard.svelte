<script lang="ts">
	import type { IExtract } from '$types/Airtable';
	import AirtableImage from '$components/AirtableImage.svelte';
	import MarkdownContent from './MarkdownContent.svelte';
	import TopicList from './TopicList.svelte';

	interface LooseleafCardProps {
		extract: IExtract;
	}

	let { extract }: LooseleafCardProps = $props();

	let michelinStars = $derived(extract.michelinStars);
	let title = $derived(extract.title);
	let images = $derived(extract.images);
	let notes = $derived(extract.notes);
	let extractText = $derived(extract.extract);
	let spaces = $derived(extract.spaces);

	const previewLength = 280;

	// Create a string of star emojis given a count
	function starRating(count: number) {
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
		<section class="extract content">
			<MarkdownContent text={extractText} trimLength={previewLength} />
		</section>
	{/if}
	{#if notes}
		<section class="notes content">
			<MarkdownContent text={notes} trimLength={previewLength} />
		</section>
	{/if}
	{#if spaces}
		<TopicList topics={spaces} />
	{/if}
</article>

<style lang="scss">
	article {
		--extract-gap: 0.75em;
		border: 1px solid var(--divider);
		padding: 1em;
		display: flex;
		flex-direction: column;
		gap: var(--extract-gap);
		word-wrap: break-word;

		.extract,
		.notes {
			font-weight: var(--font-weight-light);
		}

		.notes {
			color: var(--secondary);
			font-size: var(--font-size-small);
			border-block-start: 1px solid var(--divider);
			padding-block-start: var(--extract-gap);
		}
	}
</style>
