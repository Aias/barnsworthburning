<script lang="ts">
	import Pagination from '$components/Pagination.svelte';
	import GroupList from '../app/GroupList.svelte';
	import RecordList from '../app/RecordList.svelte';

	let { data } = $props();

	let { section, cards, groups, page, totalPages } = $derived(data);
</script>

<svelte:head>
	<title>{section.label}</title>
</svelte:head>

{#if cards}
	<RecordList records={cards} />
{:else if groups}
	<GroupList {groups} />
{/if}
<Pagination {page} {totalPages} />
