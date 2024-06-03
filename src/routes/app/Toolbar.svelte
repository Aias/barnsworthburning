<script lang="ts">
	import settings from '$lib/settings.svelte';
	import ThemeSelector from './ThemeSelector.svelte';

	let { ...restProps } = $props();
</script>

<fieldset {...restProps}>
	<fieldset class="settings-group">
		<button onclick={() => settings.toggleMode()}>Toggle Mode</button>
		<button onclick={() => settings.toggleChroma()}>Toggle Chroma</button>
	</fieldset>
	<ThemeSelector />
</fieldset>

<style lang="scss">
	.settings-group {
		display: flex;
		align-items: center;
		gap: 0.75em;
	}
</style>
