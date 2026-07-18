<script lang="ts">
	import { resolve } from '$app/paths';
	import { displayTitle, recordSlug, type RecordGroup } from '$lib/records';
	import Link from './Link.svelte';

	interface LinkGroupProps {
		group: RecordGroup;
	}
	let { group }: LinkGroupProps = $props();

	const moreItems = $derived(group.count - group.top.length);
</script>

<a
	class="group-name"
	href={resolve('/records/[id=id]/[[slug]]', {
		id: String(group.id),
		slug: recordSlug(group) || undefined
	})}>{displayTitle(group)}</a
>
{#each group.top as link (link.id)}
	<span class="group-item">
		<Link record={link} inherit>{displayTitle(link)}</Link>
	</span>
{/each}
{#if moreItems > 0}
	<span class="group-item more" aria-hidden="true">+{moreItems}</span>
{/if}

<style>
	* + *::before {
		display: inline;
		content: ' • ';
		color: var(--divider);
		padding-inline-start: var(--separation, 0.5ch);
		padding-inline-end: var(--separation, 0.5ch);
		break-after: avoid;
		break-before: avoid;
	}
	.group-name {
		font-weight: var(--font-weight-medium);
		text-transform: uppercase;
	}
	.group-item {
		color: var(--secondary);
	}
	.more {
		color: var(--hint);
	}
</style>
