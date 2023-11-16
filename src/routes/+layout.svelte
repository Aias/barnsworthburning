<script>
	import '$styles/app.css';

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

	$effect(() => {
		console.log(data)
	})
</script>

<main>
	<button on:click={mode.toggle}>Toggle Mode</button>
	<button on:click={chroma.toggle}>Toggle Chroma</button>
	<slot />
</main>