<script>
	import Testbench from '$components/Testbench.svelte';
</script>

<section>
	<Testbench />
	<Testbench mode="light" />
	<Testbench palette="indigo" chroma="chromatic" />
	<Testbench mode="light" palette="amber" chroma="chromatic">
		<Testbench palette="indigo" />
	</Testbench>	
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>