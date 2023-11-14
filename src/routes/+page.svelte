<svelte:options runes={true} />

<script>
	import Testbench from '$components/Testbench.svelte';
	import Triptych from '$components/Triptych.svelte';
</script>

<section>
	<Testbench />
	<Triptych>
		<Testbench />
	</Triptych>
	<Triptych palette="indigo" chroma="chromatic">
		<Testbench />
	</Triptych>
	<Triptych mode="light" palette="amber" chroma="chromatic">
		<Testbench>
			<Triptych palette="indigo">
				<Testbench />
			</Triptych>
		</Testbench>
	</Triptych>	
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>