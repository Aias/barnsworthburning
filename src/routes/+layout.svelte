<script lang="ts">
	import '$styles/app.css';
	import { afterNavigate, beforeNavigate, goto, pushState } from '$app/navigation';
	import { page } from '$app/state';
	import SEO from '$components/SEO.svelte';
	import interaction from '$lib/interaction.svelte';
	import settings from '$lib/settings.svelte';
	import { DEFAULT_PALETTE } from '$lib/theme/config';
	import trail, { parseTrail, trailHref, trailSegments, TRAIL_PARAM } from '$lib/trail.svelte';
	import Index from './app/Index.svelte';
	import Nav from './app/Nav.svelte';
	import SettingsMenu from './app/SettingsMenu.svelte';
	import Trail from './app/Trail.svelte';

	let { children, data } = $props();
	let bodyEl = $state<HTMLBodyElement>();
	let bodyWidth = $state<number>(0);
	let isIndex = $derived(page.route.id === '/');
	let isRecordDetail = $derived(Boolean(page.params.id));

	let { indexEntries, theme } = $derived(data);
	let trailIds = $derived(page.state.trail ?? parseTrail(page.url));
	let segments = $derived(trailSegments(trailIds, theme?.palette ?? DEFAULT_PALETTE));

	$effect.pre(() => {
		document.documentElement.className = settings.themeClass;
	});

	beforeNavigate(({ from, to, type, cancel }) => {
		const recordType = trail.takePendingRecordType();
		if (bodyWidth < 720) return; // Don't add segments when the screen is too small.
		const isNavigating = ['link', 'goto', 'form'].includes(type);
		if (!isNavigating) return;
		if (to?.route?.id === null || to?.route?.id === undefined) return;
		if (to.url.searchParams.has(TRAIL_PARAM)) return;
		const toId = Number(to.params?.id);
		const fromRecordContext = Boolean(
			from?.params?.id || from?.params?.section || from?.route.id === '/search'
		);

		// Only artifacts open as panels. Entities and concepts change the main
		// pane instead, keeping just the panel the click came from — the trail
		// explores within a context, the main pane switches between contexts.
		if (toId && fromRecordContext && recordType === 'artifact') {
			const selectedId = trail.selectedId;
			if (selectedId === toId) {
				cancel();
				void goto(trailHref(to.url, trailIds));
				return;
			}
			let nextIds = trailIds.filter((id) => id !== toId);
			if (selectedId) {
				const selectedIndex = nextIds.indexOf(selectedId);
				if (selectedIndex >= 0) nextIds = nextIds.slice(0, selectedIndex + 1);
			} else {
				nextIds = [];
			}
			nextIds.push(toId);
			cancel();
			pushState(trailHref(page.url, nextIds), { trail: nextIds });
			return;
		}

		if (toId && fromRecordContext) {
			const keepIds = trail.selectedId ? [trail.selectedId] : trailIds;
			if (keepIds.length === 0) return;
			cancel();
			void goto(trailHref(to.url, keepIds));
			return;
		}

		if (trailIds.length === 0) return;
		cancel();
		void goto(trailHref(to.url, trailIds));
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

	const clearTrail = () => {
		if (trailIds.length === 0) return;
		pushState(trailHref(page.url, []), { trail: [] });
	};

	const handleInteractions = (event: KeyboardEvent | MouseEvent) => {
		interaction.setAltKeyPressed(event.altKey);
		interaction.setMetaKeyPressed(event.metaKey);
		if (event instanceof KeyboardEvent) {
			if (event.key === 'Escape') {
				clearTrail();
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
{#if !isRecordDetail}
	<SEO />
{/if}
<svelte:body bind:this={bodyEl} bind:clientWidth={bodyWidth} />
<div class="app-contents">
	<Nav class="app-nav themed" />
	<div class="app-toolbar">
		<SettingsMenu
			class="app-settings"
			initialMode={theme?.mode}
			initialPalette={theme?.palette}
			initialChroma={theme?.chroma}
		/>
	</div>
	{#if !isIndex}
		<main class="app-main" id="app-main">
			{@render children()}
		</main>
	{/if}
	<hr />
	<footer class="app-footer">
		<Index entries={indexEntries} class="app-index" />
	</footer>
</div>
{#if !isIndex && segments.length > 0}
	<div class="aside-container">
		<button class="trail-controls chromatic" aria-label="Close Panel" onclick={clearTrail}>×</button
		>
		<aside class="app-aside">
			<Trail {segments} class="app-trail" />
		</aside>
	</div>
{/if}
