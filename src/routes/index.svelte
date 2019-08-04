<script>
	import Astrophyton from '../components/vectors/Astrophyton.svelte';
</script>

<div>
	<Astrophyton />

	<blockquote cite="https://www.bartleby.com/198/1.html">
		I should have been a pair of ragged claws <br />
		Scuttling across the floors of silent seas.
	</blockquote>	
</div>

<style>
	div {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
	}
	blockquote {
		font-style: italic;
		margin: 0;
		white-space: nowrap;
		text-align: center;
		flex: 1;
	}
</style>
