<script>
	import Extract from './Extract.svelte';
	import Card from './Card.svelte';
	import Close from './icons/Close.svelte';
	import Arrow from './icons/Arrow.svelte';
	import InternalLink from './InternalLink.svelte';
	import slugify from '../helpers/slugify';
	import select from '../helpers/select';
	import mapConnections from '../helpers/mapConnections';

	import { flip } from 'svelte/animate';
	import { stores } from '@sapper/app';
	import { derived, writable } from 'svelte/store';
	import { onMount } from 'svelte';

	const { page } = stores();

	const clientFetch = writable();

	onMount(() => {
		clientFetch.set(fetch);
	});

	const galleryData = derived([page, clientFetch], ([$page, $clientFetch], set) => {
		if (!$clientFetch) return null;

		const { params } = $page;
		const { entity: entityType, slug } = params;
		let creator, space;

		let entityQuery;
		switch (entityType) {
			case 'creators':
				entityQuery = select('creators', {
					filterByFormula: `slug = "${slug}"`
				});
				break;
			case 'spaces':
				entityQuery = select('spaces', {
					filterByFormula: `topic = "${slug}"`
				});
				break;
			default:
				console.error('Unknown entity!');
		}

		entityQuery($clientFetch)
			.then(({ records, error }) => {
				if (records) {
					const entity = records[0];
					const extractsArr = entity.extracts;
					const extractIds = extractsArr.join(',');

					select('extracts', {
						filterByFormula: `FIND(RECORD_ID(), "${extractIds}") > 0`,
						view: 'By Relevance'
					})($clientFetch).then(({ records, error }) => {
						set({
							entity,
							entityType,
							extracts: records
						});
					});
				}
			})
			.catch((error) => {
				set(null);
			});
	});

	$: params = $page.params;
	$: selectedExtract = params.extract;

	let entity, entityType, extracts, connectedSpaces, connectedCreators;

	$: {
		if ($galleryData) {
			extracts = $galleryData.extracts;
			entity = $galleryData.entity;
			entityType = $galleryData.entityType;
			connectedSpaces = mapConnections(entity.connected_spaces, entity.topic);
			connectedCreators = mapConnections(entity.connected_creators, entity.full_name);

			console.log(entity, extracts);
		}
	}
</script>

{#if entity && extracts}
	<header>
		<h1>
			{#if entityType === 'creators'}
			{entity.full_name}
			{:else}
			{entity.title || entity.topic}
			{/if}
		</h1>
		{#if selectedExtract}
		<InternalLink toExtract={false} title="Hide right-hand reading panel" aria-label="Hide reading panel">
			<Arrow direction="right" />
		</InternalLink>
		{:else}
		<InternalLink toIndex title="Close gallery (back to index)" aria-label="Close gallery (back to index)">
			<Close />
		</InternalLink>
		{/if}
	</header>
	<ul class="extract-list">
		{#each extracts as extract (extract.slug)}
		<li animate:flip="{{duration: 500}}">
			<Card>
				<Extract {extract} />
			</Card>			
		</li>
		{/each}		
	</ul>
	{#if connectedCreators || connectedSpaces}
	<footer>
		<hr />
		<em>See also:</em>
		{#if connectedSpaces}
		<ol class="spaces-list">
			{#each connectedSpaces as space}
			<li>
				<InternalLink toType="spaces" toEntity="{space}" class="topic">{space}</InternalLink>
			</li>
			{/each}
		</ol>
		{/if}
		{#if connectedCreators}
		<ol class="linked-list">
			{#each connectedCreators as creator}
			<li>
				<InternalLink toType="creators" toEntity="{slugify(creator)}">{creator}</InternalLink>
			</li>
			{/each}
		</ol>
		{/if}
	</footer>
	{/if}
{/if}

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	header > :global(a) {
		text-align: right;
		font-size: 1rem;
	}

	header > h1::first-letter {
		text-transform: capitalize;
	}

	footer {
		margin-top: 2em;
		font-size: var(--font-size-0);
	}

	.extract-list {
		margin-top: 2rem;
		list-style-type: none;
		column-width: 35ch;
	}

	.extract-list > * {
		margin-bottom: 1rem;
		-webkit-column-break-inside: avoid;
		page-break-inside: avoid;
		break-inside: avoid;
		/* Baffling Safari bug that causes parts of certain children
		   to disappear when using CSS columns, but only for items that are
		   not in the very first column.
		   
		   See: https://stackoverflow.com/questions/29624396/when-using-column-count-overflowing-content-completely-disappears-in-all-but-fi  */
		-webkit-transform: translateX(0);
		-moz-transform: translateX(0);
		transform: translateX(0);
	}
</style>
