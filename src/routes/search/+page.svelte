<script lang="ts">
	import { page } from '$app/stores';
	import Extract from '$components/Extract.svelte';
	import Looseleaf from '$components/Looseleaf.svelte';
	import TextInput from '$components/TextInput.svelte';

	const { data } = $props();
	const results = $derived(data.search);
	let compactView = $state(false);

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
	<label class="compact-toggle">
		<input type="checkbox" bind:checked={compactView} />
		Compact
	</label>
</div>

{#if results && results.length > 0}
	{#if compactView}
		<Looseleaf extracts={results} scale={0.5} />
	{:else}<ul>
			{#each results as result}
				<li>
					<Extract extract={result} componentClass="card" />
				</li>
			{/each}
		</ul>
	{/if}
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

		.compact-toggle {
			margin-inline-start: 1em;
			border-left: 1px solid var(--divider);
			padding-inline-start: 1em;
		}
	}
	ul {
		list-style: none;
		padding: 0;
		margin: 0;
		column-width: 35ch;
		column-gap: 1em;
	}
	li {
		margin-block-end: 1em;
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
