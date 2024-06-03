<script lang="ts">
	import '$styles/app.scss';
	import SEO from '$components/SEO.svelte';
	import Nav from './app/Nav.svelte';
	import cache from '$lib/cache.svelte';
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
			settings.setMode(storedMode);
		}
		if (storedChroma) {
			settings.setChroma(storedChroma);
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
<Nav class="app-header" />
<main class="app-main">
	{@render children()}
</main>
