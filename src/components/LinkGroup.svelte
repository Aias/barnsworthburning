<script lang="ts">
	import { displayTitle, recordSlug, type RecordGroup } from '#lib/records.js';
	import { resolve } from '$app/paths';
	import Link from './Link.svelte';

	interface LinkGroupProps {
		group: RecordGroup;
	}
	let { group }: LinkGroupProps = $props();

	const moreItems = $derived(group.count - group.top.length);
</script>

<span class="group-name">
	<a
		href={resolve('/records/[id=id]/[[slug]]', {
			id: group.id,
			slug: recordSlug(group) || undefined
		})}>{displayTitle(group)}</a
	>
</span>{#each group.top as link (link.id)}
	<span class="group-item">
		<Link record={link} inherit>{displayTitle(link)}</Link>
	</span>
{/each}{#if moreItems > 0}
	<span class="group-item more" aria-hidden="true">+{moreItems}</span>
{/if}

<style>
	/* Separators trail their item: the no-break space glues the dot to the
	   record before it so a line never starts with one, while the normal space
	   after it is the wrap point. Both stretch equally under justification.
	   Sibling boundaries in the template are whitespace-tight so this content
	   and padding are the only source of separation. */
	*:not(:last-child)::after {
		content: '\00a0• ';
		font-weight: var(--font-weight-normal);
		color: var(--divider);
		padding-inline: var(--separation, 0.5ch);
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
