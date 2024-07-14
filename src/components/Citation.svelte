<script lang="ts">
	import { getArticle } from '$helpers/grammar';
	import CreatorList from './CreatorList.svelte';
	import { type IExtract } from '$types/Airtable';
	import { classnames } from '$helpers/classnames';
	import Link from './Link.svelte';

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

	let { format = Format.Extract, creators, source } = $derived(extract);
</script>

{#if creators || source || format !== Format.Fragment}
	<svelte:element this={element} class:citation={true} class={classnames(className, 'text-mono')}>
		{#if format !== Format.Fragment}
			<span class="article">{getArticle(format)}</span>
			<strong class="format">{format}</strong>
		{/if}
		{#if format && creators && creators.length > 0}
			<span> by </span>
		{/if}
		{#if creators && creators.length > 0}
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

		&::after {
			content: '⤤';
			margin-inline-start: 0.75ch;
		}

		&:hover {
			opacity: 1;
			border-color: var(--border);
			text-decoration: none;
		}
	}
</style>
