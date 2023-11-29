<script>
	import { getCookie, setCookie } from '$helpers/cookies';
	import { onMount } from 'svelte';

	let { ...restProps } = $props();

	let mode = $state('dark');
	let chroma = $state('neutral');
	let paletteOptions = ['indigo', 'tomato', 'amber', 'sky', 'grass'];
	let palette = $state(paletteOptions[0]);

	const toggleMode = () => {
		mode = mode === 'dark' ? 'light' : 'dark';
		setCookie('barnsworthburning-mode', mode);
	};
	const toggleChroma = () => {
		chroma = chroma === 'neutral' ? 'chromatic' : 'neutral';
		setCookie('barnsworthburning-chroma', chroma);
	};
	const setPalette = (e) => {
		palette = e.target.value;
		setCookie('barnsworthburning-palette', palette);
	};

	let themeClass = $derived(`${mode} ${chroma} ${palette}`);

	onMount(() => {
		const storedMode = getCookie('barnsworthburning-mode');
		const storedChroma = getCookie('barnsworthburning-chroma');
		const storedPalette = getCookie('barnsworthburning-palette');

		if (storedMode) {
			mode = storedMode;
		}
		if (storedChroma) {
			chroma = storedChroma;
		}
		if (storedPalette) {
			palette = storedPalette;
		}
	});
	$effect.pre(() => {
		if (typeof window !== 'undefined') {
			document.documentElement.className = themeClass;
		}
	});
</script>

<header {...restProps}>
	<button on:click={toggleMode}>Toggle Mode</button>
	<button on:click={toggleChroma}>Toggle Chroma</button>
	<div class="theme-selector">
		<span class="text-secondary">Theme:</span>
		{#each paletteOptions as paletteKey (paletteKey)}
			<label>
				<input
					type="radio"
					name="paletteKey"
					value={paletteKey}
					on:change={setPalette}
					checked={palette === paletteKey}
				/>
				{paletteKey}
			</label>
		{/each}
	</div>
	<a class="home" href="/">Go Home</a>
</header>

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

		label {
			text-transform: capitalize;
		}
	}
	.home {
		margin-left: auto;
	}
</style>
