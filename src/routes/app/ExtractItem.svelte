<script lang="ts">
	import { setContext } from 'svelte';
	import { makeHierarchy } from '$lib/extractHierarchy.svelte';
	import Extract from '$components/Extract.svelte';
	import ExtractList from './ExtractList.svelte';
	import type { IExtract } from '$types/Airtable';

	type ExtractItemProps = {
		selectedId: string;
		extracts: IExtract[];
	};
	let { selectedId, extracts }: ExtractItemProps = $props();

	let { selected, children, connections } = $derived(makeHierarchy(extracts, selectedId));

	$effect.pre(() => {
		setContext('extract', selected);
	});
</script>

<article>
	{#if selected}
		<Extract extract={selected} class="chromatic" variant="card" suppressBlockLink />
	{/if}

	{#if children}
		{#each children as child (child.id)}
			<Extract extract={child} suppressBlockLink />
		{/each}
	{/if}

	{#if connections}
		<div class="connections-separator" role="presentation">
			<hr />
			<small class="text-secondary text-mono">See ⮂ Also</small>
			<hr />
		</div>
		<ExtractList extracts={connections} />
	{/if}
</article>

<style>
	article {
		max-width: 600px;
		margin-inline: auto;
		display: flex;
		flex-direction: column;
		gap: 2em;
	}

	.connections-separator {
		display: flex;
		align-items: center;
		gap: 1em;

		hr {
			flex: 1;
		}
	}

	.connections-separator ~ :global(*) {
		font-size: var(--font-size-small);
	}
</style>
