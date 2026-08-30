<script lang="ts">
	import GroupList from '../app/GroupList.svelte';
	import RecordList from '../app/RecordList.svelte';

	let { data } = $props();

	let { section, cards, groups } = $derived(data);
</script>

<svelte:head>
	<title>{section.label}</title>
</svelte:head>

{#if cards}
	<RecordList records={cards} />
{:else if groups}
	<GroupList {groups} />
{/if}
