<script>
	import '$styles/app.css';
	import Index from '$components/Index.svelte';
	// import { getCookie, setCookie } from '$helpers/cookies';
	
	let { data } = $props();

	function createMode(defaultMode) {
		let mode = $state(defaultMode);

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
	function createChroma(defaultChroma) {
		let chroma = $state(defaultChroma);

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
	const mode = createMode('dark');
	const chroma = createChroma('neutral');
	let palette = $state('indigo');

	let themeClass = $derived(`${mode.mode} ${chroma.chroma} ${palette}`);

	$effect(() => {
		document.documentElement.className = themeClass;
		// setCookie('barnsworthburning-mode', mode.mode);
		// setCookie('barnsworthburning-chroma', chroma.chroma);
		// setCookie('barnsworthburning-palette', palette);
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
		width: 30rem;

		&:empty {
			display: none;
		}
	}
</style>