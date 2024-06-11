<script lang="ts">
	import { getArticle } from '$helpers/grammar';
	import CreatorList from './CreatorList.svelte';
	import { type IExtract } from '$types/Airtable';
	import { classnames } from '$helpers/classnames';

	interface CitationProps {
		extract: IExtract;
		element?: string;
		class?: string;
	}

	let { extract, element = 'div', class: className }: CitationProps = $props();

	enum Format {
		Fragment = 'Fragment',
		Extract = 'Extract'
	}

	let format = $derived(extract.format === Format.Fragment ? undefined : extract.format);
	let creators = $derived(extract.creators);
</script>

{#if format || creators}
	<svelte:element this={element} class:citation={true} class={classnames(className, 'text-mono')}>
		{#if format}
			<span class="article">{getArticle(format)}</span>
			<strong class="format">{format}</strong>
		{/if}
		{#if format && creators && creators.length > 0}
			<span> by </span>
		{/if}
		{#if creators && creators.length > 0}
			<CreatorList {creators} />
		{/if}
	</svelte:element>
{/if}

<style lang="scss">
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
</style>
