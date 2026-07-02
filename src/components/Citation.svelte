<script lang="ts">
	import { getArticle } from '$helpers/grammar';
	import CreatorList from './CreatorList.svelte';
	import Link from './Link.svelte';
	import { classnames } from '$helpers/classnames';
	import { sections, type RecordCard } from '$lib/records';

	interface CitationProps {
		record: RecordCard;
		element?: string;
		class?: string;
	}

	let { record, element = 'div', class: className }: CitationProps = $props();

	let format = $derived(record.format?.title ?? sections[record.type].singular);
	let showFormat = $derived(format.toLowerCase() !== 'fragment');
	let creators = $derived(record.creators);
	let source = $derived(record.url);
</script>

{#if creators.length > 0 || source || showFormat}
	<svelte:element this={element} class:citation={true} class={classnames(className, 'text-mono')}>
		{#if showFormat}
			<span class="article">{getArticle(format)}</span>
			<strong class="format">{format}</strong>
		{/if}
		{#if creators.length > 0}
			<span> by </span>
			<CreatorList {creators} />
		{/if}
		{#if source}
			{@const sourceUrl = new URL(source)}
			<Link href={source} class="source-link" target="_blank" rel="noopener">
				{sourceUrl.hostname}
			</Link>
		{/if}
	</svelte:element>
{/if}

<style>
	.citation {
		color: var(--primary);

		& > :first-child {
			text-transform: capitalize;
		}
	}

	.format {
		text-transform: lowercase;
		color: var(--display);
	}

	:global(.source-link) {
		display: inline-block;
		padding-inline: 0.5em;
		background-color: var(--splash);
		border: 1px solid var(--divider);
		border-radius: var(--border-radius-small);
		opacity: 0.5;
		color: var(--accent);
		text-decoration: none;
		font-size: var(--font-size-tiny);
		transform: translateY(-0.065lh);

		:global(&::after) {
			content: '⤤';
			margin-inline-start: 0.75ch;
		}

		:global(&:hover) {
			opacity: 1;
			border-color: var(--border);
			text-decoration: none;
		}
	}
</style>
