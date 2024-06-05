<script lang="ts">
	import { page } from '$app/stores';
	import ExtractGallery from '$components/ExtractGallery.svelte';
	import TextInput from '$components/TextInput.svelte';

	const { data } = $props();
	const results = $derived(data.search);

	const currentQuery = $derived($page.url.searchParams.get('q'));
	let searchValue = $state('');

	$effect(() => {
		if (currentQuery) {
			searchValue = currentQuery;
		}
	});

	function updateSearchValue(event: Event) {
		const target = event.target as HTMLInputElement;
		searchValue = target.value;
	}
</script>

<div class="toolbar">
	<form data-sveltekit-keepfocus class="search-input">
		<TextInput
			type="search"
			name="q"
			placeholder="Search extracts..."
			value={searchValue}
			onchange={updateSearchValue}
			autofocus
		/>
		<button type="submit">Search</button>
	</form>
</div>

{#if results && results.length > 0}
	<ExtractGallery extracts={results} />
{:else if !currentQuery}
	<div class="empty-state">
		<p class="text-secondary">Enter a search query.</p>
	</div>
{:else}
	<p>No results.</p>
{/if}

<style lang="scss">
	.toolbar {
		margin-block-end: 1em;
		display: flex;
		align-items: center;

		.search-input {
			display: flex;
			gap: 0.5em;
			flex: 1;

			> :global(input) {
				flex: 1;
			}
		}
	}
	.empty-state {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2em;
		background-color: var(--shadow);
		border: 1px solid var(--divider);
		border-radius: var(--border-radius-medium);
	}
</style>
