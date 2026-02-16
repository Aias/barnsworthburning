<script lang="ts">
	const { data } = $props();

	const index = $derived(
		[...data.entities, ...data.concepts].sort((a, b) =>
			(a.title ?? '').localeCompare(b.title ?? '')
		)
	);

	$effect(() => {
		console.log('Entities:', data.entities);
		console.log('Concepts:', data.concepts);
	});
</script>

<ol class="index themed">
	{#each index as record (record.id)}
		<li class="index-entry">
			<a class="entity-link" href="/hozo/{record.id}">{record.title}</a>
		</li>
	{/each}
</ol>

<style>
	.index {
		column-width: 25ch;
		column-gap: 2em;
		overflow: auto;
		font-size: var(--font-size-small);
		line-height: 1.75;
	}
</style>
