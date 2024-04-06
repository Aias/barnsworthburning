<script lang="ts">
	import cache from '$lib/cache.svelte';
	import { entityTypes } from '$helpers/params';
	import ExtractGroup from '../ExtractGroup.svelte';

	let { data } = $props();

	$effect(() => {
		cache.addSpaces(data.recentSpaces);
	});

	const cachedSpaces = $derived(cache.allSpaces);
</script>

<ul class="entity-list">
	{#each cachedSpaces as entity (entity.id)}
		<li>
			<ExtractGroup
				type={entityTypes.space}
				groupId={entity.id}
				groupName={entity.topic || 'Unknown'}
				extracts={entity.extracts?.slice().reverse()}
			/>
		</li>
	{/each}
</ul>
