<script lang="ts">
	import LinkGroup from '$components/LinkGroup.svelte';
	import type { RecordGroup } from '$lib/records';

	interface GroupListProps {
		groups: RecordGroup[];
	}
	let { groups }: GroupListProps = $props();
</script>

<ul class="entity-list">
	{#each groups as group (group.id)}
		<li>
			<LinkGroup {group} />
		</li>
	{/each}
</ul>
