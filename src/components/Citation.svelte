<script lang="ts">
	import { article } from '$helpers/grammar';
	import CreatorList from './CreatorList.svelte';
	import Link from './Link.svelte';
	import type { IExtract } from '$types/Airtable';

	interface CitationProps {
		extract: IExtract;
	}

	let { extract } = $props<CitationProps>();

	let format = $derived(extract.format || 'Extract');
	let creators = $derived(extract.creators || extract.parentCreators);
	let parent = $derived(extract.parent);
	let source = $derived(extract.source);
</script>

<div class="citation">
	<div class="text-mono">
		<span class="article">{article(format)}</span>
		<strong class="format">{format}</strong>
		{#if parent}
			<span class="parent">from <Link toId={parent.id}><cite>{parent.name}</cite></Link></span
			>
		{/if}
		{#if creators}
			<span class="creators">by <CreatorList {creators} /></span>
		{/if}
		{#if source}
			<div class="source">
				<a href={source} target="_blank" rel="noreferrer">{new URL(source).hostname}</a>
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.citation {
		display: contents;
		color: var(--primary);
	}

	.type {
		text-transform: lowercase;
		color: var(--display);
	}

	cite {
		font-style: italic;
	}

	.source {
		display: inline-flex;
		white-space: nowrap;
		padding: 0 0.5em;
		background-color: var(--splash);
		border: 1px solid var(--divider);
		border-radius: 2px;
		font-size: 0.75em;
		line-height: inherit;

		a {
			color: var(--accent);
			text-decoration: none;
		}

		&:hover {
			background-color: var(--flood);
			cursor: pointer;
		}
	}
</style>
