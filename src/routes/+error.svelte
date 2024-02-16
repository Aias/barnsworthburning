<script lang="ts">
	import { page } from '$app/stores';

	let { status, error } = $page;
</script>

<svelte:head>
	<title>{status}</title>
</svelte:head>

<h1>{status}</h1>

{#if error}
	<p>{error.message}</p>
{/if}
