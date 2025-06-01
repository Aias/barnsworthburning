<script lang="ts">
	import '$styles/app.css';
	import { page } from '$app/state';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import settings from '$lib/settings.svelte';
	import interaction from '$lib/interaction.svelte';
	import trail from '$lib/trail.svelte';
	import { entityTypes, type EntityType, type EntityTypeKey } from '$helpers/params';
	import SEO from '$components/SEO.svelte';
	import Trail from './app/Trail.svelte';
	import Nav from './app/Nav.svelte';
	import Index from './app/Index.svelte';
	import SettingsMenu from './app/SettingsMenu.svelte';

	let { children, data } = $props();
	let bodyEl = $state<HTMLBodyElement>();
	let bodyWidth = $state<number>(0);
	let isIndex = $derived(page.route.id === '/');
	let isEntityDetail = $derived(page.params.id);

	let { creators, spaces, theme } = $derived(data);

	$effect.pre(() => {
		document.documentElement.className = settings.themeClass;
	});

	beforeNavigate(({ from, to, type, cancel }) => {
		if (bodyWidth < 720) return; // Don't add segments when the screen is too small.
		const isNavigating = ['link', 'goto'].includes(type);
		if (!isNavigating) return;
		const fromEntityParam = from?.params?.entityType;
		const toId = to?.params?.id;
		if (!(fromEntityParam || from?.route.id === '/search')) return; // Only add segments when navigating from an entity.
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
		const existingSegmentIndex = trail.segments.findIndex((segment) => segment.entityId === toId);
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
{#if !isEntityDetail}
	<SEO />
{/if}
<svelte:body bind:this={bodyEl} bind:clientWidth={bodyWidth} />
<div class="app-contents">
	<Nav class="app-nav themed" />
	<div class="app-toolbar">
		<SettingsMenu class="app-settings" initialTheme={theme} />
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
