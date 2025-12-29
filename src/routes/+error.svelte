<script lang="ts">
	import { page } from '$app/state';

	let status = $derived(page.status);
	let error = $derived(page.error);
</script>

<svelte:head>
	<title>Error {status}</title>
</svelte:head>

<h1>{status}</h1>

{#if error}
	<p>{error.message}</p>
{/if}
