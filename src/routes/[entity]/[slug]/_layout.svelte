<script context="module">
	import select from '../../../helpers/select';

	export async function preload({ params, query }) {
		const { entity, slug } = params;
		let creator, space;

		switch (entity) {
			case 'creators':
				creator = await select('creators', {
					filterByFormula: `slug = "${slug}"`
				})(this.fetch);
				if (creator.length > 0) creator = creator[0];
				break;
			case 'spaces':
				space = await select('spaces', {
					filterByFormula: `topic = "${slug}"`
				})(this.fetch);
				if (space.length > 0) space = space[0];
				break;
			default:
				console.error('Unknown entity!');
		}

		const extractsArr = creator ? creator.extracts : space.extracts;
		const extractIds = extractsArr.join(',');

		const extracts = await select('extracts', {
			filterByFormula: `FIND(RECORD_ID(), "${extractIds}") > 0`,
			view: 'Recently Updated'
		})(this.fetch);

		return {
			creator,
			space,
			extracts
		};
	}
</script>

<script>
	import ExtractGallery from '../../../components/ExtractGallery.svelte';

	export let creator;
	export let space;
	export let extracts;
	export let segment;
</script>

<div class="layout__gallery" class:segment="{segment}">
	<ExtractGallery {creator} {space} {extracts} />
</div>
<div class="layout__panel"><slot /></div>

<style>
	.layout__gallery {
		width: 500px;
		position: sticky;
		top: 0;
		max-height: 100vh;
		padding: var(--padding) calc(var(--padding) / 2 + 5px);
		margin: 0 calc(var(--padding) / 2 - 5px);
		overflow-y: auto;
	}

	.layout__panel {
		--transition: 0.33s ease-out;
		min-height: 100vh;
		padding: var(--padding);
		border-left: 1px solid var(--divider);
		width: var(--reading-width-narrow);
		opacity: 1;
		transition: width var(--transition), margin var(--transition), padding var(--transition);
		overflow-x: hidden;
	}

	.layout__panel:empty {
		opacity: 0;
		width: 0;
		margin: 0;
		padding: 0;
		min-height: 0;
	}
</style>
