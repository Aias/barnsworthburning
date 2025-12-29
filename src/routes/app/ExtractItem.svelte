<script lang="ts">
	import { makeHierarchy } from '$helpers/mapping';
	import Extract from '$components/Extract.svelte';
	import ExtractList from './ExtractList.svelte';
	import type { IExtract } from '$types/Airtable';

	interface ExtractItemProps {
		selectedId: string;
		extracts: IExtract[];
	}
	let { selectedId, extracts }: ExtractItemProps = $props();

	let { selected, children, connections } = $derived(makeHierarchy(extracts, selectedId));
</script>

<article>
	<Extract extract={selected} class="chromatic" variant="card" suppressBlockLink />

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
