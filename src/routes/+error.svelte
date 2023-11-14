<script>
	let { status, error } = $props();

	const dev = process.env.NODE_ENV === 'development';
</script>

<svelte:head>
	<title>{status}</title>
</svelte:head>

<h1>{status}</h1>

{#if error}
<p>{error.message}</p>
{/if} {#if dev && error && error.stack}
<pre>{error.stack}</pre>
{/if}
