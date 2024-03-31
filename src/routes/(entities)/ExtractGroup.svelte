<script lang="ts">
	import type { EntityType } from '$helpers/params';
	import type { ILinkedRecord } from '$types/Airtable';
	interface ExtractGroupProps {
		type: EntityType;
		groupId: string;
		groupName: string;
		extracts?: ILinkedRecord[];
	}
	let { type, groupId, groupName, extracts }: ExtractGroupProps = $props();

	const maxItems = 5;
	const moreItems = $derived(extracts ? extracts.length - maxItems : 0);
	const visibleExtracts = extracts ? extracts.slice(0, maxItems) : [];
</script>

<a class="group-name" href={`/${type.urlParam}/${groupId}`}>{groupName}</a>
{#if extracts}
	{#each visibleExtracts as extract (extract.id)}
		<span class="group-item">{extract.name}</span>
	{/each}
{/if}
{#if moreItems > 0}
	<span class="group-item more">+{moreItems}</span>
{/if}

<style lang="scss">
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
