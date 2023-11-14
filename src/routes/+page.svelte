<svelte:options runes={true} />

<script>
	import Triptych from '$components/Triptych.svelte';
	import { setContext } from 'svelte';

	let mode = $state('dark');

	function toggle() {
		console.log('Toggling Mode')
		mode = mode === 'dark' ? 'light' : 'dark';
	}

	setContext('mode', mode);
	setContext('palette', 'amber');
	setContext('chroma', 'neutral');
</script>

<main>
	<button on:click={toggle}>Toggle Mode from {mode}</button>
	<Triptych palette="grass">
		<Triptych chroma="chromatic">
			<Triptych mode="light"></Triptych>
		</Triptych>
	</Triptych>
	<Triptych mode="dark" />
	<Triptych mode="dark" palette="tomato" />
	<Triptych mode="dark" palette="tomato" chroma="chromatic" />
	<Triptych mode="light" />
	<Triptych mode="light" palette="indigo" />
	<Triptych mode="light" palette="indigo" chroma="chromatic" />
</main>

<style>
	main {
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
		background-color: var(--background);
		overflow: auto;
	}
</style>