<script lang="ts">
	import '$styles/app.css';
	import { page } from '$app/state';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import settings from '$lib/settings.svelte';
	import interaction from '$lib/interaction.svelte';
	import trail from '$lib/trail.svelte';
	import SEO from '$components/SEO.svelte';
	import Trail from './app/Trail.svelte';
	import Nav from './app/Nav.svelte';
	import Index from './app/Index.svelte';
	import SettingsMenu from './app/SettingsMenu.svelte';

	let { children, data } = $props();
	let bodyEl = $state<HTMLBodyElement>();
	let bodyWidth = $state<number>(0);
	let isIndex = $derived(page.route.id === '/');
	let isRecordDetail = $derived(Boolean(page.params.id));

	let { indexEntries, theme } = $derived(data);

	$effect.pre(() => {
		document.documentElement.className = settings.themeClass;
	});

	beforeNavigate(({ from, to, type, cancel }) => {
		const recordType = trail.takePendingRecordType();
		if (bodyWidth < 720) return; // Don't add segments when the screen is too small.
		const isNavigating = ['link', 'goto'].includes(type);
		if (!isNavigating) return;
		const toId = to?.params?.id ? Number(to.params.id) : undefined;
		if (!toId) return; // Only records open as panels.
		const fromRecordContext = Boolean(
			from?.params?.id || from?.params?.section || from?.route.id === '/search'
		);
		if (!fromRecordContext) return; // Only add segments when navigating from records, lists, or search.

		const selectedSegment = trail.selected;

		// Only artifacts open as panels. Entities and concepts change the main
		// pane instead, keeping just the panel the click came from — the trail
		// explores within a context, the main pane switches between contexts.
		if (recordType !== 'artifact') {
			if (selectedSegment) {
				trail.removeExceptSegment(selectedSegment.entityId);
			}
			return;
		}

		// A record already in the trail moves to the end.
		if (trail.segments.some((segment) => segment.entityId === toId)) {
			trail.removeSegment(toId);
		}

		if (selectedSegment) {
			if (selectedSegment.entityId === toId) {
				// Don't cancel navigation if the selected segment is the same as toId.
				return;
			}
			trail.removeAfterSegment(selectedSegment.entityId);
		} else {
			trail.clearTrail();
		}
		trail.addSegment(toId);
		cancel();
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
