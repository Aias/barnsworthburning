<script lang="ts">
	import { entityTypes, type EntityType } from '$helpers/params';
	import type { ILinkedRecord } from '$types/Airtable';
	import Link from '$components/Link.svelte';

	interface ExtractGroupProps {
		groupType: EntityType;
		groupId: string;
		groupName: string;
		links?: ILinkedRecord[];
		linkType?: EntityType;
	}
	let {
		groupType,
		groupId,
		groupName,
		links,
		linkType = entityTypes.extract
	}: ExtractGroupProps = $props();

	const maxItems = 5;
	const moreItems = $derived(links ? links.length - maxItems : 0);
	const visibleLinks = links ? links.slice(0, maxItems) : [];
</script>

<a class="group-name" href={`/${groupType.urlParam}/${groupId}`}>{groupName}</a>
{#if links}
	{#each visibleLinks as link (link.id)}
		<span class="group-item">
			<Link class="inherit" toId={link.id} toType={linkType.id}>{link.name}</Link>
		</span>
	{/each}
{/if}
{#if moreItems > 0}
	<span class="group-item more" aria-hidden="true">+{moreItems}</span>
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
