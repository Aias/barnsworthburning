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

	async function fetchCreator(creatorId: string) {
		const [creatorPromise, extractsPromise] = await Promise.all([
			api.creators.get(creatorId),
			api.creators.extracts(creatorId)
		]);
		creator = creatorPromise;
		space = undefined;
		extracts = extractsPromise;
	}
	async function fetchSpace(spaceId: string) {
		const [spacePromise, extractsPromise] = await Promise.all([
			api.spaces.get(spaceId),
			api.spaces.extracts(spaceId)
		]);
		creator = undefined;
		space = spacePromise;
		extracts = extractsPromise;
	}
	async function fetchExtracts(extractId: string) {
		const extractsPromise = await api.extracts.related(extractId);
		creator = undefined;
		space = undefined;
		extracts = extractsPromise;
	}

	$effect.pre(() => {
		setContext('trailSegment', segment);
	});

	$effect(() => {
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

{#if extracts}
	{#if creator}
		<EntityItem title={creator.name} {extracts} />
	{:else if space}
		<EntityItem title={capitalize(space.title || space.topic)} {extracts} />
	{:else}
		<ExtractItem {extracts} selectedId={entityId} />
	{/if}
{:else}
	<div class="loading-container">
		<p><em>Loading...</em></p>
		<div class="loader"></div>
	</div>
{/if}

<style lang="scss">
	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		gap: 0.5rem;
	}
	p {
		color: var(--accent);
	}
	// https://css-loaders.com/progress/
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
