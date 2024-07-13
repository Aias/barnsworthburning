<script lang="ts">
	import { setContext } from 'svelte';
	import EntityItem from './EntityItem.svelte';
	import ExtractItem from './ExtractItem.svelte';
	import { entityTypes } from '$helpers/params';
	import { api } from '$lib/api';
	import cache from '$lib/cache.svelte';
	import type { ICreator, IExtract, ISpace } from '$types/Airtable';
	import { capitalize } from '$helpers/grammar';
	import type { TrailSegment } from '$lib/trail.svelte';

	type TrailSegmentProps = {
		segment: TrailSegment;
	};
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
		cache.addCreators([creatorPromise]);
		space = undefined;
		extracts = extractsPromise;
		cache.addExtracts(extractsPromise);
	}
	async function fetchSpace(spaceId: string) {
		const [spacePromise, extractsPromise] = await Promise.all([
			api.spaces.get(spaceId),
			api.spaces.extracts(spaceId)
		]);
		creator = undefined;
		space = spacePromise;
		cache.addSpaces([spacePromise]);
		extracts = extractsPromise;
		cache.addExtracts(extractsPromise);
	}
	async function fetchExtracts(extractId: string) {
		const extractsPromise = await api.extracts.related(extractId);
		creator = undefined;
		space = undefined;
		extracts = extractsPromise;
		cache.addExtracts(extractsPromise);
	}

	$effect.pre(() => {
		setContext('trailSegment', segment);
	});

	$effect(() => {
		if ($state.is(entityType, entityTypes.creator)) {
			fetchCreator(entityId);
		} else if ($state.is(entityType, entityTypes.space)) {
			fetchSpace(entityId);
		} else if ($state.is(entityType, entityTypes.extract)) {
			fetchExtracts(entityId);
		}
	});
</script>

{#if extracts}
	{#if creator}
		<EntityItem title={creator.name} {extracts} />
	{:else if space}
		<EntityItem title={capitalize(space.title || space.topic)} {extracts} />
	{:else}
		<ExtractItem extractId={entityId} />
	{/if}
{:else}
	<p>Loading...</p>
{/if}
