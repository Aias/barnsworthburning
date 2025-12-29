<script lang="ts">
	import { setContext } from 'svelte';
	import EntityItem from './EntityItem.svelte';
	import ExtractItem from './ExtractItem.svelte';
	import { entityTypes } from '$helpers/params';
	import { api } from '$lib/api';
	import type { ICreator, IExtract, ISpace } from '$types/Airtable';
	import { capitalize } from '$helpers/grammar';
	import type { TrailSegment } from '$lib/trail.svelte';
	import { error } from '@sveltejs/kit';

	interface TrailSegmentProps {
		segment: TrailSegment;
	}
	let { segment }: TrailSegmentProps = $props();

	let { entityType, entityId } = $derived(segment);

	let creator = $state<ICreator>();
	let space = $state<ISpace>();
	let extracts = $state<IExtract[]>();
	let fetchError = $state<string>();
	let currentFetchId = $state<string>();

	async function fetchCreator(creatorId: string) {
		currentFetchId = creatorId;
		try {
			const [creatorResult, extractsResult] = await Promise.all([
				api.creators.get(creatorId),
				api.creators.extracts(creatorId)
			]);
			if (currentFetchId !== creatorId) return;
			creator = creatorResult;
			space = undefined;
			extracts = extractsResult;
			fetchError = undefined;
		} catch (e) {
			if (currentFetchId !== creatorId) return;
			fetchError = e instanceof Error ? e.message : 'Failed to load creator';
		}
	}
	async function fetchSpace(spaceId: string) {
		currentFetchId = spaceId;
		try {
			const [spaceResult, extractsResult] = await Promise.all([
				api.spaces.get(spaceId),
				api.spaces.extracts(spaceId)
			]);
			if (currentFetchId !== spaceId) return;
			creator = undefined;
			space = spaceResult;
			extracts = extractsResult;
			fetchError = undefined;
		} catch (e) {
			if (currentFetchId !== spaceId) return;
			fetchError = e instanceof Error ? e.message : 'Failed to load space';
		}
	}
	async function fetchExtracts(extractId: string) {
		currentFetchId = extractId;
		try {
			const extractsResult = await api.extracts.related(extractId);
			if (currentFetchId !== extractId) return;
			creator = undefined;
			space = undefined;
			extracts = extractsResult;
			fetchError = undefined;
		} catch (e) {
			if (currentFetchId !== extractId) return;
			fetchError = e instanceof Error ? e.message : 'Failed to load extracts';
		}
	}

	$effect.pre(() => {
		setContext('trailSegment', segment);
	});

	$effect(() => {
		fetchError = undefined;
		extracts = undefined;
		switch (entityType.key) {
			case entityTypes.extract.key:
				fetchExtracts(entityId);
				break;
			case entityTypes.creator.key:
				fetchCreator(entityId);
				break;
			case entityTypes.space.key:
				fetchSpace(entityId);
				break;
			default:
				error(500, 'Unknown entity type');
				break;
		}
	});
</script>

{#if fetchError}
	<div class="error-container" role="alert">
		<p>Error: {fetchError}</p>
	</div>
{:else if extracts}
	{#if creator}
		<EntityItem title={creator.name} {extracts} />
	{:else if space}
		<EntityItem title={capitalize(space.title || space.topic)} {extracts} />
	{:else}
		<ExtractItem {extracts} selectedId={entityId} />
	{/if}
{:else}
	<div class="loading-container" role="status" aria-busy="true">
		<p><em>Loading...</em></p>
		<div class="loader"></div>
	</div>
{/if}

<style>
	.loading-container,
	.error-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		gap: 0.5rem;
	}
	.loading-container p {
		color: var(--accent);
	}
	.error-container p {
		color: var(--danger, #c53030);
	}
	/* https://css-loaders.com/progress/ */
	.loader {
		height: 0.25rem;
		width: 100%;
		border-radius: var(--border-radius-small);
		--c: no-repeat linear-gradient(var(--main) 0 0);
		background: var(--c), var(--c), var(--sink);
		background-size: 60% 100%;
		animation: l16 3s infinite;
	}
	@keyframes l16 {
		0% {
			background-position:
				-150% 0,
				-150% 0;
		}
		66% {
			background-position:
				250% 0,
				-150% 0;
		}
		100% {
			background-position:
				250% 0,
				250% 0;
		}
	}
</style>
