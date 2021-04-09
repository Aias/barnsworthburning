<script context="module">
	import select from '../../../helpers/select';

	export async function load({ page, fetch }) {
		const { params } = page;
		const { entity, slug } = params;
		let creator, space;

		switch (entity) {
			case 'creators':
				const { records: creators, errorC } = await select('creators', {
					filterByFormula: `slug = "${slug}"`
				})(fetch);
				if (creators) creator = creators[0]; // Reduce to single value (since select always returns an array).
				break;
			case 'spaces':
				const { records: spaces, errorS } = await select('spaces', {
					filterByFormula: `topic = "${slug}"`
				})(fetch);
				if (spaces) space = spaces[0];
				break;
			default:
				console.error('Unknown entity!');
		}

		if(creator || space) {
			const extractsArr = creator ? creator.extracts : space.extracts;
			const extractIds = extractsArr.join(',');

			const { records: extracts, errorE } = await select('extracts', {
				filterByFormula: `FIND(RECORD_ID(), "${extractIds}") > 0`,
				view: 'By Relevance'
			})(fetch);

			return {
				props: {
					creator,
					space,
					extracts					
				}
			};			
		}
		else {
			return {
				error: new Error('Failed to fetch entity.')
			};
		}
	}
</script>

<script>
	import ExtractGallery from '../../../components/ExtractGallery.svelte';

	export let creator;
	export let space;
	export let extracts;
	export let segment;
</script>

{#if creator || space}
<div class="layout__gallery" class:segment="{segment}">
	<ExtractGallery {creator} {space} {extracts} />
</div>
<div class="layout__panel"><slot /></div>
{/if}