<script lang="ts">
	import { entityTypes } from '$helpers/params';
	import LinkGroup from '$components/LinkGroup.svelte';
	import type { ISpace } from '$types/Airtable';

	type SpaceListProps = {
		spaces: ISpace[];
	};
	let { spaces }: SpaceListProps = $props();
</script>

<ul class="entity-list">
	{#each spaces as space (space.id)}
		{@const { id, topic, extracts } = space}
		{@const groupName = topic || 'Unknown'}
		<li>
			<LinkGroup
				groupType={entityTypes.space}
				groupId={id}
				{groupName}
				links={extracts?.slice().reverse()}
			/>
		</li>
	{/each}
</ul>
