<script lang="ts">
	import { classnames } from '$helpers/classnames';
	import { getArticle } from '$helpers/grammar';
	import { formatLabel, type RecordCard } from '$lib/records';
	import { ArrowUpRightIcon } from '@lucide/svelte';
	import CreatorList from './CreatorList.svelte';
	import Link from './Link.svelte';

	interface CitationProps {
		record: RecordCard;
		element?: string;
		class?: string;
	}

	let { record, element = 'div', class: className }: CitationProps = $props();

	let format = $derived(formatLabel(record.format));
	let creators = $derived(record.creators);
	let attributions = $derived(record.attributions);
	let source = $derived(record.url);
</script>

{#if format || creators.length > 0 || attributions.length > 0 || source}
	<svelte:element this={element} class:citation={true} class={classnames(className, 'text-mono')}>
		{#if format}
			<span class="article">{getArticle(format)}</span>
			<strong class="format">{format}</strong>
		{/if}
		{#if creators.length > 0}
			{#if format}
				<span> by </span>
			{/if}
			<CreatorList {creators} />
		{/if}{#each attributions as group, i (group.label)}{#if format || creators.length > 0 || i > 0};{/if}
			<span class="attribution">{group.label}</span>
			<CreatorList creators={group.records} />{/each}
		{#if source}
			{@const sourceUrl = new URL(source)}
			<Link href={source} class="source-link" target="_blank" rel="noopener">
				{sourceUrl.hostname}&nbsp;<ArrowUpRightIcon />
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
		translate: 0 -0.065lh;

		:global(& .lucide) {
			margin-inline-start: -0.5ch;
			translate: 0 0.1lh;
		}

		:global(&:hover) {
			opacity: 1;
			border-color: var(--border);
			text-decoration: none;
		}
	}
</style>
