<script>
	import '$styles/app.css';
	import Index from '$components/Index.svelte';
	
	let { data } = $props();

	function createMode() {
		let mode = $state('dark');

		function toggle() {
			mode = mode === 'dark' ? 'light' : 'dark';
		}

		return {
			get mode() {
				return mode;
			},
			toggle
		}
	}
	function createChroma() {
		let chroma = $state('neutral');

		function toggle() {
			chroma = chroma === 'neutral' ? 'chromatic' : 'neutral';
		}

		return {
			get chroma() {
				return chroma;
			},
			toggle
		}
	}
	function createPalette() {
		let palette = $state('indigo');

		function change(key) {
			palette = key;
		}

		return {
			get palette() {
				return palette;
			},
			change
		}
	}

	const mode = createMode();
	const chroma = createChroma();
	const palette = createPalette();

	let themeClass = $derived(`${mode.mode} ${chroma.chroma} ${palette.palette}`);

	$effect(() => {
		document.documentElement.className = themeClass;
	});

</script>

<header>
	<button on:click={mode.toggle}>Toggle Mode</button>
	<button on:click={chroma.toggle}>Toggle Chroma</button>		
</header>
<main>
	<Index creators={data.creators} spaces={data.spaces} />
	<slot />
</main>

<style lang="scss">
	header {
		padding: 0.5rem;
		border-bottom: 1px solid var(--divider);
		background-color: var(--paper);
		position: sticky;
		top: 0;
		z-index: 10;
		display: flex;
		gap: 0.5rem;
	}
	main { 
		padding: var(--padding);
	}
</style>