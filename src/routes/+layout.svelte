<script lang="ts">
	import '$styles/app.scss';
	import Nav from './app/Nav.svelte';
	import { page } from '$app/stores';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import cache from '$lib/cache.svelte';
	import { Palette, Mode, Chroma } from '$types/Theme';
	import settings from '$lib/settings.svelte';
	import interaction from '$lib/interaction.svelte';
	import trail from '$lib/trail.svelte';
	import { entityTypes, type EntityType, type EntityTypeKey } from '$helpers/params';
	import { getCookie } from '$helpers/cookies';
	import Trail from './app/Trail.svelte';
	import Index from './app/Index.svelte';
	import SettingsMenu from './app/SettingsMenu.svelte';

	let { children, data } = $props();
	let bodyEl: HTMLBodyElement | undefined;
	let bodyWidth: number = $state(0);
	let isIndex = $derived($page.route.id === '/');

	let { creators, spaces } = $derived(data);

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

	beforeNavigate(({ from, to, type, cancel }) => {
		if (bodyWidth < 720) return; // Don't add segments when the screen is too small.
		const isNavigating = ['link', 'goto'].includes(type);
		if (!isNavigating) return;
		const fromId = from?.params?.id;
		const fromEntityParam = from?.params?.entityType;
		const toId = to?.params?.id;
		if (!fromEntityParam) return; // Only add segments when navigating from an entity.
		if (!toId) return; // Don't add segments for unknown entities.
		const toEntityParam = to?.params?.entityType;
		let fromEntityType: EntityType | undefined;
		let toEntityType: EntityType | undefined;
		for (const key in entityTypes) {
			const type = entityTypes[key as EntityTypeKey];
			if (type.urlParam === fromEntityParam) {
				fromEntityType = type;
			}
			if (type.urlParam === toEntityParam) {
				toEntityType = type;
			}
			if (fromEntityType && toEntityType) break;
		}
		if (!toEntityType) return; // Don't add segments for unknown entity types.

		// Check if toId already exists in the trail and remove it
		const existingSegmentIndex = trail.segments.findIndex(
			(segment) => segment.entityId === toId
		);
		if (existingSegmentIndex >= 0) {
			trail.removeSegment(toId);
		}

		const selectedSegment = trail.selected;
		if (selectedSegment) {
			const { entityId: selectedId } = selectedSegment;
			if (selectedId === toId) {
				// Don't cancel navigation if the selected segment is the same as toId.
				return;
			}
			// if (toId === fromId) return; // Don't add segments for the same entity.
			if (toEntityType === entityTypes.extract) {
				trail.removeAfterSegment(selectedId);
				trail.addSegment(toEntityType, toId);
				cancel();
			} else {
				trail.removeExceptSegment(selectedId);
			}
		} else {
			if (toEntityType === entityTypes.extract) {
				trail.clearTrail();
				trail.addSegment(toEntityType, toId);
				cancel();
			}
		}
	});

	afterNavigate(() => {
		const main = document.getElementById('app-main');
		if (main) {
			main.scrollTo({ top: 0, behavior: 'instant' });
		}
	});

	$effect(() => {
		if (!bodyEl) return;
		bodyEl.classList.toggle('show-super-secret-menus', interaction.metaKeyPressed);
	});

	const handleInteractions = (event: KeyboardEvent | MouseEvent) => {
		interaction.setAltKeyPressed(event.altKey);
		interaction.setMetaKeyPressed(event.metaKey);
		if (event instanceof KeyboardEvent) {
			if (event.key === 'Escape') {
				trail.clearTrail();
			}
		}
	};
</script>

<svelte:window
	on:keydown={handleInteractions}
	on:keyup={handleInteractions}
	on:mouseenter={handleInteractions}
	on:mouseleave={handleInteractions}
/>
<svelte:body bind:this={bodyEl} bind:clientWidth={bodyWidth} />
<div class="app-contents">
	<Nav class="app-nav themed" />
	<div class="app-toolbar">
		<SettingsMenu class="app-settings" />
	</div>
	{#if !isIndex}
		<main class="app-main" id="app-main">
			{@render children()}
		</main>
	{/if}
	<hr />
	<footer class="app-footer">
		<Index {creators} {spaces} class="app-index" />
	</footer>
</div>
{#if !isIndex && trail.length > 0}
	<div class="aside-container">
		<button
			class="trail-controls chromatic"
			aria-label="Close Panel"
			onclick={() => trail.clearTrail()}>×</button
		>
		<aside class="app-aside">
			<Trail class="app-trail" />
		</aside>
	</div>
{/if}
