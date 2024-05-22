<script lang="ts">
	import settings from '$lib/settings.svelte';
	import ThemeSelector from './ThemeSelector.svelte';

	let { ...restProps } = $props();
</script>

<header {...restProps}>
	<fieldset class="settings-group">
		<button onclick={() => settings.toggleMode()}>Toggle Mode</button>
		<button onclick={() => settings.toggleChroma()}>Toggle Chroma</button>
	</fieldset>
	<ThemeSelector />
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
</style>
