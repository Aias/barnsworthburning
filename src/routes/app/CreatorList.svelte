<script lang="ts">
	import { entityTypes } from '$helpers/params';
	import LinkGroup from '$components/LinkGroup.svelte';
	import type { ICreator } from '$types/Airtable';

	interface CreatorListProps {
		creators: ICreator[];
	}
	let { creators }: CreatorListProps = $props();
</script>

<ul class="entity-list">
	{#each creators as entity (entity.id)}
		<li>
			<LinkGroup
				groupType={entityTypes.creator}
				groupId={entity.id}
				groupName={entity.name || 'Unknown'}
				links={entity.extracts}
			/>
		</li>
	{/each}
</ul>
