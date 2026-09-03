<script lang="ts">
	import RecordCard from '#components/RecordCard.svelte';
	import RecordGallery from '#components/RecordGallery.svelte';
	import RelationList from '#components/RelationList.svelte';
	import { displayTitle, relationRows, type RecordPage } from '#lib/records.js';
	import { similarRecords } from '#lib/records.remote.js';
	import { ArrowLeftRightIcon } from '@lucide/svelte';
	import RecordList from './RecordList.svelte';

	interface RecordItemProps {
		page: RecordPage;
	}
	let { page }: RecordItemProps = $props();

	let { record, references, children, relations, associated } = $derived(page);
	let rows = $derived(relationRows(relations));
	// Semantic neighbors load after the record itself, so navigation never
	// waits on the similarity query.
	let similarQuery = $derived(record.type === 'artifact' ? similarRecords(record.id) : undefined);
	let similar = $derived(similarQuery?.current ?? []);
</script>

{#if record.type === 'artifact'}
	<article>
		<RecordCard {record} class="chromatic" variant="card" pageRecordId={record.id} />

		{#each children as child (child.id)}
			<RecordCard record={child} pageRecordId={record.id} />
		{/each}

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

		{#if similar.length > 0}
			<div class="connections-separator" role="presentation">
				<hr />
				<small class="text-secondary text-mono">See <ArrowLeftRightIcon /> Also</small>
				<hr />
			</div>
			<div class="neutral">
				<RecordList records={similar} />
			</div>
		{/if}
	</article>
{:else}
	<header>
		<h1>
			{displayTitle(record)}
			{#if record.abbreviation}<small class="text-secondary">({record.abbreviation})</small>{/if}
		</h1>
		{#if rows.length > 0}
			<nav class="relations">
				{#each rows as row (row.label)}
					<RelationList items={row.items} symbol={row.symbol} label={row.label} />
				{/each}
			</nav>
		{/if}
	</header>
	{#if associated.length > 0}
		<RecordGallery records={associated} />
	{:else}
		<em>No associated records.</em>
	{/if}
{/if}

<style>
	header {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
		margin-block-end: 1em;
	}

	.relations {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
		font-size: var(--font-size-small);
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

		small {
			text-transform: capitalize;
		}

		hr {
			flex: 1;
		}
	}

	.connections-separator ~ :global(*) {
		font-size: var(--font-size-small);
	}
</style>
