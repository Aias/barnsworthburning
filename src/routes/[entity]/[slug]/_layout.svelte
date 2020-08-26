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

<div>
	<ExtractGallery {creator} {space} {extracts} />
	<slot />
</div>
