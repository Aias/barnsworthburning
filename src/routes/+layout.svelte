<script lang="ts">
	import '$styles/app.scss';
	import SEO from '$components/SEO.svelte';
	import Nav from './app/Nav.svelte';
	import { page } from '$app/stores';
	import cache from '$lib/cache.svelte';
	import { Palette, Mode, Chroma } from '$types/Theme';
	import settings from '$lib/settings.svelte';
	import interaction from '$lib/interaction.svelte';
	import { getCookie } from '$helpers/cookies';

	let { children, data } = $props();

	let isIndex = $derived($page.route.id === '/');

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

	const handleKeyPress = (event: KeyboardEvent) => {
		interaction.setAltKeyPressed(event.altKey);
		interaction.setMetaKeyPressed(event.metaKey);
	};
</script>

<svelte:window on:keydown={handleKeyPress} on:keyup={handleKeyPress} />
<SEO />
<Nav class="app-header" />
{#if !isIndex}
	<main class="app-main">
		{@render children()}
	</main>
{/if}
