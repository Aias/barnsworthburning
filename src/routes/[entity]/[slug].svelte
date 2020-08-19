<script context="module">
	import select from '../../helpers/select';

	export async function preload({ params, query }) {
		const { entity, slug } = params;
		let creator, space;

		switch (entity) {
			case 'creator':
				creator = await select('creators', {
					filterByFormula: `slug = "${slug}"`
				})(this.fetch);
				if (creator.length > 0) creator = creator[0];
				break;
			case 'space':
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
			filterByFormula: `FIND(RECORD_ID(), "${extractIds}") > 0`
		})(this.fetch);

		console.log(extracts);

		return {
			params,
			creator,
			space,
			extracts
		};
	}
</script>

<script>
	export let params;
	export let creator;
	export let space;
	export let extracts;
</script>

<div class="wrapper">
	<a href="/">Close Panel</a>
	<pre>{JSON.stringify(params)}</pre>
	<pre>{JSON.stringify(creator)}</pre>
	<pre>{JSON.stringify(space)}</pre>
	<pre>{JSON.stringify(extracts)}</pre>
</div>

<style>
	.wrapper {
		width: 500px;
	}

	pre {
		overflow-x: auto;
		white-space: pre-wrap;
	}
</style>
