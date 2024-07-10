<script lang="ts">
	import '$styles/app.scss';
	import SEO from '$components/SEO.svelte';
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
	import { classnames } from '$helpers/classnames';
	import TrailSegment from './app/TrailSegment.svelte';

	let { children, data } = $props();
	let bodyEl: HTMLBodyElement | undefined;
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

	beforeNavigate(({ from, to, type, cancel }) => {
		const isNavigating = ['link', 'goto'].includes(type);
		if (!isNavigating) return;
		const fromId = from?.params?.id;
		const toId = to?.params?.id;
		const toEntityParam = to?.params?.entityType;
		if (!(fromId && toId)) return; // Only add segments when an entity is already selected.
		let toEntityType: EntityType | undefined;
		for (const key in entityTypes) {
			const type = entityTypes[key as EntityTypeKey];
			if (type.urlParam === toEntityParam) {
				toEntityType = type;
				break;
			}
		}
		if (!toEntityType) return; // Don't add segments for unknown entity types.
		if (
			trail.segments.some(
				({ entityType, entityId }) =>
					$state.is(entityType, toEntityType) && $state.is(entityId, toId)
			)
		) {
			// Don't add duplicate segments.
			trail.removeSegment(toId);
			return;
		}
		// If above checks pass, add a new segment.
		// trail.addSegment(toEntityType, toId);
		// cancel();
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
<SEO />
<svelte:body bind:this={bodyEl} />
<Nav class="app-header" />
{#if !isIndex}
	<main class="app-main" id="app-main">
		{@render children()}
	</main>
{/if}
{#if trail.length > 0}
	<aside class="app-trail">
		<ul class="segments">
			{#each trail.segments as { entityId, entityType, color, addedOn } (addedOn)}
				<li class={classnames('chromatic', color)}>
					<hr class="separator" />
					<div class="segment">
						<TrailSegment {entityId} {entityType} />
					</div>
				</li>
			{/each}
		</ul>
	</aside>
{/if}
