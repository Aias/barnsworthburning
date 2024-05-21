<script lang="ts">
	import settings from '$lib/settings.svelte';

	let { ...restProps } = $props();
</script>

<header {...restProps}>
	<fieldset class="settings-group">
		<button onclick={() => settings.toggleMode()}>Toggle Mode</button>
		<button onclick={() => settings.toggleChroma()}>Toggle Chroma</button>
	</fieldset>
	<fieldset class="settings-group theme-selector">
		{#each settings.paletteOptions as paletteKey (paletteKey)}
			<label>
				<input
					type="radio"
					name="paletteKey"
					value={paletteKey}
					onchange={(e) => settings.setPalette((e.target as HTMLInputElement).value as typeof paletteKey)}
					checked={settings.palette === paletteKey}
				/>
				{paletteKey}
			</label>
		{/each}
	</fieldset>
</header>

<style lang="scss">
	header {
		padding-block: 0.5em;
		padding-inline: 1em;
		background-color: var(--paper);
		border-block-end: 1px solid var(--divider);
		display: flex;
		align-items: center;
		max-inline-size: 100%;
		overflow: auto;
		gap: 2em;
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
