<script lang="ts">
	import cache from '$lib/cache.svelte';
	import { entityTypes } from '$helpers/params';
	import LinkGroup from '$components/LinkGroup.svelte';

	let { data } = $props();

	$effect(() => {
		cache.addCreators(data.recentCreators);
	});

	const cachedCreators = $derived(cache.allCreators);
</script>

<svelte:head>
	<title>barnsworthburning</title>
</svelte:head>
<ul class="entity-list">
	{#each cachedCreators as entity (entity.id)}
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
