<script lang="ts">
	import EntityItem from '../../app/EntityItem.svelte';

	let { data } = $props();

	let creator = $derived(data.creator);
	let extracts = $derived(data.extractsByCreator);

	let title = $derived(creator.name ?? 'Unknown');
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>
<EntityItem {title} {extracts} />
