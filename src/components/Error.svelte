<script>
	export let error;

	$: {
		console.log(error);
	}
</script>

{#if error}
<pre>
{JSON.stringify(error)}
</pre>
{/if}

<style>
	pre {
		position: fixed;
		top: 50%;
		left: 50%;
		max-width: 50%;
		transform: translate(-50%, -50%);
	}
</style>
