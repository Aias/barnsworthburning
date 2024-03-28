<script lang="ts">
	import { getCookie, setCookie } from '$helpers/cookies';
	import { Palette, Mode, Chroma } from '$types/Theme';

	let { ...restProps } = $props();

	let mode: Mode = $state(Mode.Dark);
	let chroma: Chroma = $state(Chroma.Neutral);
	const paletteOptions: Palette[] = [
		Palette.Indigo,
		Palette.Tomato,
		Palette.Amber,
		Palette.Sky,
		Palette.Grass
	];
	let palette: Palette | undefined = $state();

	const toggleMode = () => {
		mode = mode === Mode.Dark ? Mode.Light : Mode.Dark;
		setCookie('barnsworthburning-mode', mode);
	};
	const toggleChroma = () => {
		chroma = chroma === Chroma.Neutral ? Chroma.Chromatic : Chroma.Neutral;
		setCookie('barnsworthburning-chroma', chroma);
	};
	const setPalette = (event: Event) => {
		palette = (event.currentTarget as HTMLInputElement).value as Palette;
		setCookie('barnsworthburning-palette', palette);
	};

	let themeClass = $derived(`${mode} ${chroma} ${palette}`);

	$effect.pre(() => {
		const storedMode = getCookie('barnsworthburning-mode') as Mode | null;
		const storedChroma = getCookie('barnsworthburning-chroma') as Chroma | null;
		const storedPalette = getCookie('barnsworthburning-palette') as Palette | null;

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
	<fieldset class="settings-group theme-selector">
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
	<fieldset class="settings-group">
		<button onclick={toggleMode}>Toggle Mode</button>
		<button onclick={toggleChroma}>Toggle Chroma</button>
	</fieldset>
</header>

<style lang="scss">
	header {
		padding-block: 0.5rem;
		padding-inline: 1rem;
		border-bottom: 1px solid var(--divider);
		background-color: var(--paper);
		position: sticky;
		top: 0;
		z-index: 10;
		display: flex;
		align-items: center;
		max-width: 100%;
		overflow-x: auto;
		gap: 2em;
	}
	nav {
		margin-inline-end: auto;
		display: inline-flex;
		gap: 1em;
	}
	.settings-group {
		display: flex;
		align-items: center;
		gap: 0.75em;
	}
	.theme-selector {
		label {
			text-transform: capitalize;
		}
	}
</style>
