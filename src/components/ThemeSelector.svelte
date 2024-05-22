<script lang="ts">
	import settings from '$lib/settings.svelte';
	import { Palette } from '$types/Theme';

	let themeColor = $state('#000000');

	const titleCase = (str: string) => str[0].toUpperCase() + str.slice(1);

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
	<meta name="theme-color" content={themeColor} />
</svelte:head>
<fieldset class="theme-selector">
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
				checked={settings.palette === paletteKey}
			/>
		</label>
	{/each}
</fieldset>

<style lang="scss">
	.theme-selector {
		display: flex;
		gap: 4px;
		flex-wrap: wrap;

		&:has(input:focus-visible) {
			outline: 1px solid var(--main);
			outline-offset: 4px;
			border-radius: 2px;
		}

		label {
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
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
				}
			}
		}
	}
</style>
