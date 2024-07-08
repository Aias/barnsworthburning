<script lang="ts">
	import '$styles/app.scss';
	import SEO from '$components/SEO.svelte';
	import Nav from './app/Nav.svelte';
	import { page } from '$app/stores';
	import { beforeNavigate } from '$app/navigation';
	import cache from '$lib/cache.svelte';
	import { Palette, Mode, Chroma } from '$types/Theme';
	import settings from '$lib/settings.svelte';
	import interaction from '$lib/interaction.svelte';
	import trail from '$lib/trail.svelte';
	import { entityTypes, type EntityTypeKey } from '$helpers/params';
	import { getCookie } from '$helpers/cookies';
	import { classnames } from '$helpers/classnames';

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

	// beforeNavigate(({ from, to, type, cancel }) => {
	// 	const isNavigating = ['link', 'goto'].includes(type);
	// 	if (!isNavigating) return;
	// 	if (!to?.params?.id) return;
	// 	let id = to.params.id;
	// 	let entityType;
	// 	const { route } = to;
	// 	if (!route.id) return;
	// 	for (const key in entityTypes) {
	// 		const type = entityTypes[key as EntityTypeKey];
	// 		if (route.id.startsWith(`/${type.urlParam}`)) {
	// 			entityType = type;
	// 			break;
	// 		}
	// 	}
	// 	if (!id || !entityType) return;
	// 	trail.addSegment(entityType, id);
	// 	cancel();
	// });

	$effect(() => {
		if (!bodyEl) return;
		bodyEl.classList.toggle('show-super-secret-menus', interaction.metaKeyPressed);
	});

	const handleInteractions = (event: KeyboardEvent | MouseEvent) => {
		interaction.setAltKeyPressed(event.altKey);
		interaction.setMetaKeyPressed(event.metaKey);
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
	<main class="app-main">
		{@render children()}
	</main>
{/if}
{#if trail.length > 0}
	<aside class="app-trail">
		<ul class="segments">
			{#each trail.segments as { entityId, entityType, color, addedOn } (addedOn)}
				<li class={classnames('chromatic', color)}>
					<hr class="separator" />
					<article class="segment">
						<h3>{entityType.title}</h3>
						<p>{entityId}</p>
						<p>This is segment {color}</p>
						<button type="reset" onclick={() => trail.removeSegment(entityId)}
							>Close</button
						>
					</article>
				</li>
			{/each}
		</ul>
	</aside>
{/if}
