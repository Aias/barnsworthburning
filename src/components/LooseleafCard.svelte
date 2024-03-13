<script lang="ts">
	import type { IExtract } from '$types/Airtable';
	import AirtableImage from '$components/AirtableImage.svelte';
	import markdown from '$helpers/markdown';
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

	// Function to trim a string to a certain length
	function trimString(string: string, length: number) {
		if (string.length > length) {
			return string.substring(0, length) + '...';
		} else {
			return string;
		}
	}

	function makeMarkdown(string: string) {
		const trimmed = trimString(string, previewLength);
		const html = markdown.render(trimmed);
		return html;
	}

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
		<section class="extract">{@html makeMarkdown(extractText)}</section>
	{/if}
	{#if notes}
		<section class="notes">
			<small>{@html makeMarkdown(notes)}</small>
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
