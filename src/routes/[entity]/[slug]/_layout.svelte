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
</script>

<main class="wrapper">
	<div class="gallery">
		<ExtractGallery {creator} {space} {extracts} />
	</div>
	<div class="panel"><slot /></div>
</main>

<style>
	.wrapper {
		display: flex;
		position: relative;
	}
	.gallery {
		width: 500px;
		position: sticky;
		top: var(--padding);
		max-height: calc(100vh - 1 * var(--padding));
		padding-bottom: var(--padding);
		margin-bottom: calc(-1 * var(--padding));
		padding-right: 1.5rem;
		margin-right: -1.5rem;
		overflow-y: auto;
	}

	.panel {
		--transition: 0.33s ease-out;
		min-height: 100vh;
		margin: calc(-1 * var(--padding)) 0 calc(-1 * var(--padding)) 2rem;
		padding: var(--padding) 0 var(--padding) 2rem;
		border-left: 1px solid var(--divider);
		width: var(--reading-width-narrow);
		opacity: 1;
		transition: width var(--transition), margin var(--transition), padding var(--transition);
		overflow-x: hidden;
	}

	.panel:empty {
		opacity: 0;
		width: 0;
		margin: 0;
		padding: 0;
	}
</style>
