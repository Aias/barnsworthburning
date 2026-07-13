<script lang="ts">
	import RecordCard from '$components/RecordCard.svelte';
	import RecordGallery from '$components/RecordGallery.svelte';
	import { displayTitle, type RecordCard as RecordCardData, type RecordPage } from '$lib/records';
	import { ArrowLeftRightIcon } from '@lucide/svelte';
	import { parse } from 'devalue';
	import RecordList from './RecordList.svelte';

	interface RecordItemProps {
		page: RecordPage;
	}
	let { page }: RecordItemProps = $props();

	let { record, references, children, connections, associated } = $derived(page);
	let similar = $state<RecordCardData[]>([]);

	// Semantic neighbors load after the record itself, so navigation never
	// waits on the similarity query.
	$effect(() => {
		similar = [];
		if (record.type !== 'artifact') return;
		const { id } = record;
		let cancelled = false;
		void (async () => {
			const response = await fetch(`/records/${id}/similar.json`);
			if (!response.ok || cancelled) return;
			const parsed: RecordCardData[] = parse(await response.text());
			if (!cancelled) {
				similar = parsed;
			}
		})();
		return () => {
			cancelled = true;
		};
	});
</script>

{#if record.type === 'artifact'}
	<article>
		<RecordCard {record} class="chromatic" variant="card" suppressBlockLink />

		{#each references as group (group.label)}
			<section class="reference-group">
				<div class="connections-separator" role="presentation">
					<hr />
					<small class="text-secondary text-mono">{group.label}</small>
					<hr />
				</div>
				<RecordList records={group.records} />
			</section>
		{/each}

		{#each children as child (child.id)}
			<RecordCard record={child} suppressBlockLink />
		{/each}

		{#if connections.length > 0 || similar.length > 0}
			<div class="connections-separator" role="presentation">
				<hr />
				<small class="text-secondary text-mono">See <ArrowLeftRightIcon /> Also</small>
				<hr />
			</div>
			{#if connections.length > 0}
				<RecordList records={connections} />
			{/if}
			{#if similar.length > 0}
				<div class="neutral">
					<RecordList records={similar} />
				</div>
			{/if}
		{/if}
	</article>
{:else}
	<h1>
		{displayTitle(record)}
		{#if record.abbreviation}<small class="text-secondary">({record.abbreviation})</small>{/if}
	</h1>
	{#if associated.length > 0}
		<RecordGallery records={associated} />
	{:else}
		<em>No associated records.</em>
	{/if}
{/if}

<style>
	h1 {
		margin-block-end: 0.5em;
	}

	article {
		max-width: 600px;
		margin-inline: auto;
		display: flex;
		flex-direction: column;
		gap: 2em;
	}

	.reference-group {
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
