<script lang="ts">
	import { getCookie, setCookie } from '$helpers/cookies';
	import { onMount } from 'svelte';

	let { ...restProps } = $props();

	let mode = $state('dark');
	let chroma = $state('neutral');
	const paletteOptions = ['indigo', 'tomato', 'amber', 'sky', 'grass'];
	let palette = $state(paletteOptions[0]);

	const toggleMode = () => {
		mode = mode === 'dark' ? 'light' : 'dark';
		setCookie('barnsworthburning-mode', mode);
	};
	const toggleChroma = () => {
		chroma = chroma === 'neutral' ? 'chromatic' : 'neutral';
		setCookie('barnsworthburning-chroma', chroma);
	};
	const setPalette = (event: Event) => {
		palette = (event.currentTarget as HTMLInputElement).value;
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
	$effect(() => {
		document.documentElement.className = themeClass;
	});
</script>

<header {...restProps}>
	<nav>
		<a href="/">Home</a>
		<a href="/search">Search</a>
	</nav>
	<fieldset class="theme-selector">
		{#each paletteOptions as paletteKey (paletteKey)}
			<label>
				<input
					type="radio"
					name="paletteKey"
					value={paletteKey}
					onchange={setPalette}
					checked={palette === paletteKey}
				/>
				{paletteKey}
			</label>
		{/each}
	</fieldset>
	<button onclick={toggleMode}>Toggle Mode</button>
	<button onclick={toggleChroma}>Toggle Chroma</button>
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
	nav {
		margin-right: auto;
		display: inline-flex;
		gap: 1em;
	}
	.theme-selector {
		display: flex;
		align-items: center;
		gap: 0.75em;

		label {
			text-transform: capitalize;
		}
	}
</style>
