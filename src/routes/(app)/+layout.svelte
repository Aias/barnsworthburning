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
	let palette = $state('indigo');

	let themeClass = $derived(`${mode.mode} ${chroma.chroma} ${palette}`);

	$effect(() => {
		document.documentElement.className = themeClass;
	});

</script>

<header>
	<button on:click={mode.toggle}>Toggle Mode</button>
	<button on:click={chroma.toggle}>Toggle Chroma</button>
	<div class="theme-selector">
		<span class="text-secondary">Theme:</span>
		<label>
			<input type="radio" name="theme" value="indigo" bind:group={palette} />
			Indigo
		</label>
		<label>
			<input type="radio" name="theme" value="tomato" bind:group={palette} />
			Tomato
		</label>
		<label>
			<input type="radio" name="theme" value="amber" bind:group={palette} />
			Amber
		</label>
		<label>
			<input type="radio" name="theme" value="sky" bind:group={palette} />
			Sky
		</label>
	</div>
	<a class="home" href="/">Go Home</a>
</header>
<main>
	<Index creators={data.creators} spaces={data.spaces} />
	<article class="chromatic"><slot /></article>
</main>

<style lang="scss">
	header {
		padding: 0.5rem 1rem;
		border-bottom: 1px solid var(--divider);
		background-color: var(--paper);
		position: sticky;
		top: 0;
		z-index: 10;
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	.theme-selector {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.home {
		margin-left: auto;
	}
	main { 
		padding: var(--padding);
		display: flex;
		flex-direction: row;
		gap: var(--padding);
	}
	article {
		padding: var(--padding);
		margin: calc(-1 * var(--padding));
		margin-left: 0;
		background-color: var(--background);
		border-left: 1px solid var(--edge);
		width: 25rem;

		&:empty {
			display: none;
		}
	}
</style>