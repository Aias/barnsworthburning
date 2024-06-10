<script lang="ts">
	import { getArticle } from '$helpers/grammar';
	import CreatorList from './CreatorList.svelte';
	import SourceLink from './SourceLink.svelte';
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
	let source = $derived(extract.source);
</script>

<svelte:element this={element} class:citation={true} class:text-mono={true} class={className}>
	{#if creators.length > 0 || format.toLowerCase() !== Format.Fragment.toLowerCase()}
		<span class="article">{getArticle(format)}</span>
		<strong class="format">{format}</strong>
	{/if}
	{#if creators.length > 0}
		<span class="creators">by <CreatorList {creators} /></span>
	{/if}
	{#if source}
		<SourceLink href={source} />
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
</style>
