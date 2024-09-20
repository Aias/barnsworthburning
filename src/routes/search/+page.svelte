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

	$effect(() => {
		if (results) {
			highlightSearchResults(searchValue);
		}
	});

	function updateSearchValue(event: Event) {
		const target = event.target as HTMLInputElement;
		searchValue = target.value;
	}

	function highlightSearchResults(searchValue: string) {
		if (!CSS.highlights) return; // Check for browser support

		CSS.highlights.clear();

		if (!searchValue.trim()) return;

		const ranges: Range[] = [];
		const extractElements = document.querySelectorAll('.extract');
		const query = searchValue.toLowerCase();

		extractElements.forEach((el) => {
			const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
			let node: Text | null;
			while ((node = walker.nextNode() as Text | null)) {
				const text = node.textContent?.toLowerCase() ?? '';
				let match: RegExpExecArray | null;
				const regex = new RegExp(query, 'gi');
				while ((match = regex.exec(text)) !== null) {
					const range = new Range();
					range.setStart(node, match.index);
					range.setEnd(node, match.index + query.length);
					ranges.push(range);
				}
			}
		});

		const searchHighlight = new Highlight(...ranges);
		CSS.highlights.set('search-results', searchHighlight);
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
