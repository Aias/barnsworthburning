<script lang="ts">
	import cache from '$lib/cache.svelte';
	import { entityTypes } from '$helpers/params';
	import ExtractGroup from '$components/ExtractGroup.svelte';

	let { data } = $props();

	$effect(() => {
		cache.addCreators(data.recentCreators);
	});

	const cachedCreators = $derived(cache.allCreators);
</script>

<svelte:head>
	<title>barnsworthburning · creators</title>
</svelte:head>
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
