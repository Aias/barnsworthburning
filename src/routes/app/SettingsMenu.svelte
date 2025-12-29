<script lang="ts">
	import settings from '$lib/settings.svelte';
	import { Chroma, Mode, Palette } from '$types/Theme';

	interface SettingsMenuProps {
		initialMode?: Mode;
		initialPalette?: Palette;
		initialChroma?: Chroma;
		class?: string;
	}

	let { initialMode, initialPalette, initialChroma, ...restProps }: SettingsMenuProps = $props();

	let themeColor = $state<string>();

	const titleCase = (str: string) => (str ? str[0].toUpperCase() + str.slice(1) : '');

	const setThemeColor = () => {
		const checkedInput = document.querySelector('input[name="paletteKey"]:checked');
		if (checkedInput) {
			const label = checkedInput.closest('label');
			if (label) {
				themeColor = getComputedStyle(label).color;
			}
		}
	};

	$effect(() => {
		setThemeColor();
	});

	// Use initial theme from server if available, otherwise fall back to settings
	// eslint-disable-next-line svelte/no-unused-svelte-ignore -- needed for svelte-check
	// svelte-ignore state_referenced_locally -- intentional SSR hydration pattern
	let currentMode = $state(initialMode ?? settings.mode);
	// svelte-ignore state_referenced_locally
	let currentPalette = $state(initialPalette ?? settings.palette);
	// svelte-ignore state_referenced_locally
	let currentChroma = $state(initialChroma ?? settings.chroma);

	// After initial render, sync with settings
	$effect(() => {
		const hasInitialTheme = initialMode !== undefined;
		if (
			!hasInitialTheme ||
			(settings.mode === currentMode &&
				settings.palette === currentPalette &&
				settings.chroma === currentChroma)
		) {
			// Already in sync or no initial theme, use settings values
			currentMode = settings.mode;
			currentPalette = settings.palette;
			currentChroma = settings.chroma;
		}
	});

	const handleThemeChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		const newTheme = target.value as Palette;
		const label = target.closest('label');
		if (label) {
			themeColor = getComputedStyle(label).color;
		}
		settings.setPalette(newTheme);
	};
</script>

<svelte:head>
	{#if themeColor}
		<meta name="theme-color" content={themeColor} />
	{/if}
</svelte:head>

<menu {...restProps}>
	<li>
		<fieldset class="theme-selector">
			<legend class="screenreader">Color Theme</legend>
			{#each settings.paletteOptions as paletteKey (paletteKey)}
				<label
					class={paletteKey}
					class:chromatic={true}
					aria-label={titleCase(paletteKey)}
					title={titleCase(paletteKey)}
				>
					<input
						type="radio"
						name="paletteKey"
						class="screenreader"
						value={paletteKey}
						onchange={handleThemeChange}
						checked={currentPalette === paletteKey}
					/>
				</label>
			{/each}
		</fieldset>
	</li>
	<li>
		<fieldset class="mode-selector">
			<legend class="screenreader">Light/Dark Mode</legend>
			<label aria-label="Day Mode" title="Day Mode"
				><input
					type="radio"
					name="modeKey"
					class="screenreader"
					checked={currentMode === Mode.Light}
					onchange={() => settings.setMode(Mode.Light)}
				/>🌅</label
			>
			<label aria-label="Match System Mode" title="Match System Mode"
				><input
					type="radio"
					name="modeKey"
					class="screenreader"
					checked={currentMode === Mode.Auto}
					onchange={() => settings.setMode(Mode.Auto)}
				/>🌄</label
			>
			<label aria-label="Night Mode" title="Night Mode"
				><input
					type="radio"
					name="modeKey"
					class="screenreader"
					checked={currentMode === Mode.Dark}
					onchange={() => settings.setMode(Mode.Dark)}
				/>🌌</label
			>
		</fieldset>
	</li>
	<li>
		<fieldset class="chroma-selector">
			<legend class="screenreader">Chroma Setting</legend>
			<label aria-label="Toggle Chroma" title="Toggle Chroma"
				><input
					type="checkbox"
					name="chromaKey"
					class="screenreader"
					checked={currentChroma === Chroma.Chromatic}
					onchange={() => settings.setChroma()}
				/>🎨</label
			>
		</fieldset>
	</li>
</menu>

<style>
	menu {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		font-size: 0.875rem;
	}
	fieldset {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 4px;
		flex-wrap: wrap;
		height: 1lh;

		&:has(input:focus-visible) {
			outline: 1px solid var(--main);
			outline-offset: 4px;
			border-radius: 2px;
		}
	}
	.theme-selector {
		label {
			font-size: 1.15em;
			text-transform: capitalize;
			cursor: pointer;
			display: block;
			width: 1em;
			aspect-ratio: 1;
			border-radius: 4px;
			background-color: var(--flood);
			border: 1px solid var(--border);
			position: relative;

			&:hover {
				border-color: var(--edge);
				background-color: var(--sink);
			}

			&:has(input:checked) {
				color: var(--main);
				background-color: currentColor;
				border-color: var(--edge);

				&::after {
					color: var(--main-contrast);
					content: '✔';
					display: block;
					font-size: 0.75em;
					line-height: 1;
					position: absolute;
					inset-block-start: 50%;
					inset-inline-start: 50%;
					transform: translate(-50%, -50%);
				}
			}
		}
	}
	.mode-selector,
	.chroma-selector {
		label {
			position: relative;
			opacity: 0.5;
			color: var(--display);
			&:has(input:checked) {
				opacity: 1;
				&::after {
					--border-height: 2px;
					content: '';
					display: block;
					position: absolute;
					inset-inline: 0;
					inset-block-end: calc(-1 * var(--border-height));
					height: var(--border-height);
					border-radius: calc(var(--border-height) / 2);
					background-color: var(--main);
				}
			}
		}
	}
</style>
