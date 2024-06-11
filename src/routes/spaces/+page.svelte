<script lang="ts">
	import cache from '$lib/cache.svelte';
	import { entityTypes } from '$helpers/params';
	import LinkGroup from '$components/LinkGroup.svelte';

	let { data } = $props();

	$effect(() => {
		cache.addSpaces(data.recentSpaces);
	});

	const cachedSpaces = $derived(cache.allSpaces);
</script>

<svelte:head>
	<title>barnsworthburning</title>
</svelte:head>
<ul class="entity-list">
	{#each cachedSpaces as entity (entity.id)}
		<li>
			<LinkGroup
				groupType={entityTypes.space}
				groupId={entity.id}
				groupName={entity.topic || 'Unknown'}
				links={entity.extracts?.slice().reverse()}
			/>
		</li>
	{/each}
</ul>
