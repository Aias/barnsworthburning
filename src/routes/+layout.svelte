<script lang="ts">
	import '$styles/app.scss';
	import Header from '$components/Header.svelte';
	import SEO from '$components/SEO.svelte';
	import cache from '$lib/cache.svelte';
	import Index from '$components/Index.svelte';
	import { Palette, Mode, Chroma } from '$types/Theme';
	import settings from '$lib/settings.svelte';
	import interaction from '$lib/interaction.svelte';
	import { getCookie } from '$helpers/cookies';

	let { children, data } = $props();

	$effect.pre(() => {
		const storedMode = getCookie('barnsworthburning-mode') as Mode | null;
		const storedChroma = getCookie('barnsworthburning-chroma') as Chroma | null;
		const storedPalette = getCookie('barnsworthburning-palette') as Palette | null;

		if (storedMode) {
			settings.toggleMode(storedMode);
		}
		if (storedChroma) {
			settings.toggleChroma(storedChroma);
		}
		if (storedPalette) {
			settings.setPalette(storedPalette);
		}

		document.documentElement.className = settings.themeClass;
	});

	$effect(() => {
		if (data.extracts) {
			cache.addExtracts(data.extracts);
		}
		if (data.creators) {
			cache.addCreators(data.creators);
		}
		if (data.spaces) {
			cache.addSpaces(data.spaces);
		}
	});

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.altKey) {
			interaction.setAltKeyPressed(true);
		}
		if (event.metaKey) {
			interaction.setMetaKeyPressed(true);
		}
	};
	const handleKeyup = (event: KeyboardEvent) => {
		if (!event.altKey) {
			interaction.setAltKeyPressed(false);
		}
		if (!event.metaKey) {
			interaction.setMetaKeyPressed(false);
		}
	};
</script>

<svelte:window on:keydown={handleKeydown} on:keyup={handleKeyup} />
<SEO />
<Header class="app-header" />
<main class="app-container">
	<Index class="app-index" />
	<div class="app-content">
		{@render children()}
	</div>
</main>
