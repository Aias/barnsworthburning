<script lang="ts">
	import { page } from '$app/state';
	import Link from '$components/Link.svelte';
	import RecordGallery from '$components/RecordGallery.svelte';
	import TextInput from '$components/TextInput.svelte';
	import { highlightSearchResults } from '$helpers/highlight';
	import { sections } from '$lib/records';
	import { SvelteURLSearchParams } from 'svelte/reactivity';

	const { data } = $props();
	const results = $derived(data.results);
	const activeType = $derived(data.type);
	const currentQuery = $derived(page.url.searchParams.get('q'));
	let searchValue = $state('');

	$effect(() => {
		if (currentQuery) {
			searchValue = currentQuery;
		}
	});

	$effect(() => {
		if (results) {
			highlightSearchResults(searchValue);
		}
	});

	function updateSearchValue(event: Event) {
		const target = event.target as HTMLInputElement;
		searchValue = target.value;
	}

	const filterUrl = (recordType = '') => {
		const params = new SvelteURLSearchParams();
		if (currentQuery) params.set('q', currentQuery);
		if (recordType) params.set('type', recordType);
		const search = params.toString();
		return search ? `/search?${search}` : '/search';
	};
</script>

<div class="toolbar">
	<form data-sveltekit-keepfocus class="search-input">
		<TextInput
			type="search"
			name="q"
			placeholder="Search records..."
			value={searchValue}
			onchange={updateSearchValue}
			autofocus
		/>
		{#if activeType}
			<input type="hidden" name="type" value={activeType} />
		{/if}
		<button type="submit">Search</button>
	</form>
	<nav class="type-filter text-mono" aria-label="Filter by type">
		<Link href={filterUrl()} active={!activeType} data-sveltekit-keepfocus>All</Link>
		{#each Object.values(sections) as section (section.type)}
			<Link
				href={filterUrl(section.type)}
				active={activeType === section.type}
				data-sveltekit-keepfocus>{section.label}</Link
			>
		{/each}
	</nav>
</div>

{#if results && results.length > 0}
	<RecordGallery records={results} />
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
		gap: 1.5em;

		.search-input {
			display: flex;
			gap: 0.5em;
			flex: 1;

			& > :global(input) {
				flex: 1;
			}
		}
	}
	.type-filter {
		display: flex;
		gap: 1em;
		font-size: var(--font-size-small);

		:global(a) {
			color: var(--secondary);
			text-decoration: none;

			&:hover {
				color: var(--link);
			}

			&.active {
				color: var(--accent);
				text-decoration: underline;
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
