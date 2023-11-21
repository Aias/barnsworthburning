<script>
	import { getCookie, setCookie } from '$helpers/cookies';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';

	const mode = writable('dark');
	const chroma = writable('neutral');
	const palette = writable('indigo');
	const themes = ['indigo', 'tomato', 'amber', 'sky', 'grass'];

	const toggleMode = () => {
		mode.update((currentMode) => (currentMode === 'dark' ? 'light' : 'dark'));
		setCookie('barnsworthburning-mode', $mode);
	};
	const toggleChroma = () => {
		chroma.update((currentChroma) => (currentChroma === 'neutral' ? 'chromatic' : 'neutral'));
		setCookie('barnsworthburning-chroma', $chroma);
	};
	const setPalette = (e) => {
		palette.set(e.target.value);
		setCookie('barnsworthburning-palette', $palette);
	};

	$: themeClass = `${$mode} ${$chroma} ${$palette}`;

	onMount(() => {
		const storedMode = getCookie('barnsworthburning-mode');
		const storedChroma = getCookie('barnsworthburning-chroma');
		const storedPalette = getCookie('barnsworthburning-palette');

		if (storedMode) {
			$mode = storedMode;
		}
		if (storedChroma) {
			$chroma = storedChroma;
		}
		if (storedPalette) {
			$palette = storedPalette;
		}
	});
	$: {
		if (typeof window !== 'undefined') {
			document.documentElement.className = themeClass;
		}
	}
</script>

<header {...$$restProps}>
	<button on:click={toggleMode}>Toggle Mode</button>
	<button on:click={toggleChroma}>Toggle Chroma</button>
	<div class="theme-selector">
		<span class="text-secondary">Theme:</span>
		{#each themes as theme (theme)}
			<label>
				<input type="radio" name="theme" value={theme} on:change={setPalette} checked={$palette === theme} />
				{theme}
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
