<script>
	export let error;

	$: {
		console.log(error);
	}
</script>

{#if error}
<div>
	<h2>Sorry, something went wrong.</h2>
	<pre>
	{error}
	</pre
	>
</div>
{/if}

<style>
	div {
		position: fixed;
		top: 50%;
		left: 50%;
		max-width: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
	}
	pre {
		max-width: 100%;
		overflow-x: auto;
	}
</style>
