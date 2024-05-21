<script lang="ts">
	import { article } from '$helpers/grammar';
	import CreatorList from './CreatorList.svelte';
	import Link from './Link.svelte';
	import type { IExtract } from '$types/Airtable';

	interface CitationProps {
		extract: IExtract;
	}

	let { extract }: CitationProps = $props();

	let format = $derived(extract.format || 'Extract');
	let creators = $derived(extract.creators || extract.parentCreators);
	let parent = $derived(extract.parent);
	let source = $derived(extract.source);
</script>

<div class="citation text-mono">
	<span class="article">{article(format)}</span>
	<strong class="format">{format}</strong>
	{#if creators}
		<span class="creators">by <CreatorList {creators} /></span>
	{/if}
	{#if parent}
		<span class="parent">from <Link toId={parent.id}><cite>{parent.name}</cite></Link></span>
	{/if}
	{#if source}
		<a class="source" href={source} target="_blank" rel="noreferrer" title="View source">
			{new URL(source).hostname}
		</a>
	{/if}
</div>

<style lang="scss">
	.citation {
		color: var(--primary);
	}

	.format {
		text-transform: lowercase;
		color: var(--display);
	}

	cite {
		font-style: italic;
	}

	.source {
		display: inline-flex;
		white-space: nowrap;
		padding-block: 0;
		padding-inline: 0.5em;
		background-color: var(--splash);
		border: 1px solid var(--divider);
		border-radius: var(--border-radius-small);
		font-size: 0.75em;
		line-height: inherit;
		transform: translateY(-0.1lh);
		color: var(--accent);
		text-decoration: none;

		&:hover {
			background-color: var(--flood);
			border-color: var(--boundary);
			cursor: pointer;
		}
	}
</style>
