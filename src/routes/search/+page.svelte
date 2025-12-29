<script lang="ts">
	import { page } from '$app/state';
	import ExtractGallery from '$components/ExtractGallery.svelte';
	import TextInput from '$components/TextInput.svelte';
	import { highlightSearchResults } from '$helpers/highlight';

	const { data } = $props();
	const results = $derived(data.results);
	const currentQuery = $derived(page.url.searchParams.get('q'));
	let searchValue = $state('');

	$effect(() => {
		if (currentQuery) {
			searchValue = currentQuery;
		}
	});

	$effect(() => {
		if (results && currentQuery) {
			highlightSearchResults(currentQuery);
		}
	});
</script>

<div class="toolbar">
	<form data-sveltekit-keepfocus class="search-input">
		<label for="search-input" class="screenreader">Search extracts</label>
		<TextInput
			id="search-input"
			type="search"
			name="q"
			placeholder="Search extracts..."
			bind:value={searchValue}
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

<style>
	.toolbar {
		margin-block-end: 1em;
		display: flex;
		align-items: center;

		.search-input {
			display: flex;
			gap: 0.5em;
			flex: 1;

			& > :global(input) {
				flex: 1;
			}
		}
	}
	@supports (-webkit-touch-callout: none) {
		.toolbar {
			font-size: max(1rem, 16px); /* Prevent Safari auto-zooming on input focus. */
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
	:global(::highlight(search-results)) {
		background-color: var(--main);
		color: var(--main-contrast);
	}
</style>
