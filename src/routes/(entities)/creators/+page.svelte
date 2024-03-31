<script lang="ts">
	import cache from '$lib/cache.svelte';
	import { entityTypes } from '$helpers/params';
	import ExtractGroup from '../ExtractGroup.svelte';

	const cachedCreators = $derived(cache.allCreators);
</script>

<ul class="entity-list">
	{#each cachedCreators as entity (entity.id)}
		<li>
			<ExtractGroup
				type={entityTypes.creator}
				groupId={entity.id}
				groupName={entity.name || 'Unknown'}
				extracts={entity.extracts}
			/>
		</li>
	{/each}
</ul>
