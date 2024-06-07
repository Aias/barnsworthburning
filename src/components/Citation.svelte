<script lang="ts">
	import { article } from '$helpers/grammar';
	import CreatorList from './CreatorList.svelte';
	import Link from './Link.svelte';
	import { type IExtract } from '$types/Airtable';
	import { getContext } from 'svelte';

	interface CitationProps {
		extract: IExtract;
		element?: string;
		class?: string;
	}

	let { extract, element = 'div', class: className }: CitationProps = $props();

	let extractContext = getContext<IExtract | undefined>('extract');

	enum Format {
		Fragment = 'Fragment',
		Extract = 'Extract'
	}

	let format = $derived(extract.format || Format.Fragment);
	let creators = $derived.by(() => {
		let fullList = extract.creators || extract.parentCreators || [];
		if (!extractContext) return fullList;
		if (extractContext.id === extract.id) return fullList;

		const contextCreators = extractContext.creators || [];
		return fullList.filter((creator) => !contextCreators.find((c) => c.id === creator.id));
	});
	let parent = $derived(extract.parent);
	let source = $derived(extract.source);
</script>

<svelte:element this={element} class:citation={true} class:text-mono={true} class={className}>
	{#if creators.length > 0 || format.toLowerCase() !== Format.Fragment.toLowerCase()}
		<span class="article">{article(format)}</span>
		<strong class="format">{format}</strong>
	{/if}
	{#if creators.length > 0}
		<span class="creators">by <CreatorList {creators} /></span>
	{/if}
	{#if parent && parent.id !== extractContext?.id}
		<span class="parent">from <Link toId={parent.id}><cite>{parent.name}</cite></Link></span>
	{/if}
	{#if source}
		<a class="source" href={source} target="_blank" rel="noreferrer" title="View source">
			{new URL(source).hostname}
		</a>
	{/if}
</svelte:element>

<style lang="scss">
	.citation {
		color: var(--primary);
	}
	.citation:empty {
		display: none;
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
		transform: translateY(-0.1em);
		break-before: avoid;
		color: var(--accent);
		text-decoration: none;

		&:hover {
			background-color: var(--flood);
			border-color: var(--boundary);
			cursor: pointer;
		}

		&::after {
			content: '⤤';
			margin-inline-start: 1ch;
		}
	}
</style>
