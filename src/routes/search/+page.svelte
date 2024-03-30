<script lang="ts">
	import { page } from '$app/stores';
	import Extract from '$components/Extract.svelte';
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

<!-- svelte-ignore a11y-autofocus -->
<form data-sveltekit-keepfocus>
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

{#if results && results.length > 0}
	<ul>
		{#each results as result}
			<li>
				<Extract extract={result} componentClass="card" />
			</li>
		{/each}
	</ul>
{:else if !currentQuery}
	<div class="empty-state">
		<p class="text-secondary">Enter a search query.</p>
	</div>
{:else}
	<p>No results.</p>
{/if}

<style lang="scss">
	form {
		margin-block-end: 1em;
		display: flex;
		gap: 0.25em;

		> :global(input) {
			flex: 1;
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
